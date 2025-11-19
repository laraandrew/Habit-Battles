import mongoose from 'mongoose';



const ParticipantSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    dailyPctTotals: { // optional per-day capture
        type: [Number], 
        default: [] 
    } 
}, { _id: false });


const ChallengeSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    startDate: { 
        type: Date, 
        required: true,
        default: Date.now
    },
    durationDays: { 
        type: Number, 
        min: [7, 'Duration must be at least 7 days'], 
        max: [365, 'Duration cannot be longer than 1 year'], 
        required: true 
    },
    participants: { 
        type: [ParticipantSchema], 
        default: [] 
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });


ChallengeSchema.virtual('endDate').get(function () {
    const d = new Date(this.startDate);
    d.setDate(d.getDate() + this.durationDays);
    return d;
});


ChallengeSchema.methods.updateParticipantPct = function (userId, pct) {
    const p = this.participants.find(p => p.user.toString() === String(userId));
    if (!p) throw new Error('Participant not in challenge');
    p.dailyPctTotals.push(pct);
};


ChallengeSchema.methods.averagePct = function (userId) {
    const p = this.participants.find(p => p.user.toString() === String(userId));
    if (!p || !p.dailyPctTotals.length) return 0;
    const sum = p.dailyPctTotals.reduce((a,b) => a + b, 0);
    return Math.round(sum / p.dailyPctTotals.length);
};


ChallengeSchema.methods.winner = function () {
    if (!this.participants.length) return null;
    let best = null, bestAvg = -1;
    for (const p of this.participants) {
        const avg = p.dailyPctTotals.length
        ? Math.round(p.dailyPctTotals.reduce((a,b)=>a+b,0) / p.dailyPctTotals.length)
        : 0;
        if (avg > bestAvg) { bestAvg = avg; best = p.user; }
    }
    return { user: best, avg: bestAvg };
};


export const Challenge = mongoose.model('Challenge', ChallengeSchema);