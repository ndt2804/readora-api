import mongoose from 'mongoose';
export const connectMongoDb = async () => {
    console.log('Connecting to MongoDB...');
    try {
        await mongoose.connect(process.env.mongodbURl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}