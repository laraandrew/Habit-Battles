import mongoose from 'mongoose';


export async function connectDB(uri) {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(uri, { autoIndex: true });
    } catch (e) {
        console.log(e.message)
    }
}


export async function disconnectDB() {
    await mongoose.connection.close();
}