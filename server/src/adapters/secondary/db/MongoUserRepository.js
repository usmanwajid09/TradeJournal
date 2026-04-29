import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import IUserRepository from '../../../core/domain/repositories/IUserRepository.js';
import User from '../../../core/domain/entities/User.js';

/**
 * User Schema - Mongoose Model
 */
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'Trader' },
    createdAt: { type: Date, default: Date.now }
});

const UserModel = mongoose.model('User', UserSchema);

/**
 * MongoUserRepository - Secondary Adapter
 * Implements the IUserRepository port using MongoDB/Mongoose.
 */
class MongoUserRepository extends IUserRepository {
    async findByEmail(email) {
        const mongoUser = await UserModel.findOne({ email });
        if (!mongoUser) return null;
        return this._toDomain(mongoUser);
    }

    async findById(id) {
        const mongoUser = await UserModel.findById(id);
        if (!mongoUser) return null;
        return this._toDomain(mongoUser);
    }

    async save(userEntity) {
        // Domain entity to Mongo document
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(userEntity.password, salt);

        const mongoUser = new UserModel({
            name: userEntity.name,
            email: userEntity.email,
            password: passwordHash,
            role: userEntity.role || 'Trader'
        });

        const savedUser = await mongoUser.save();
        return this._toDomain(savedUser);
    }

    /**
     * Helper to map Mongo document to Domain Entity
     */
    _toDomain(mongoUser) {
        return new User({
            id: mongoUser._id,
            name: mongoUser.name,
            email: mongoUser.email,
            password: mongoUser.password, // This will be the hashed one
            role: mongoUser.role,
            createdAt: mongoUser.createdAt
        });
    }
}

export default MongoUserRepository;
export { UserModel };
