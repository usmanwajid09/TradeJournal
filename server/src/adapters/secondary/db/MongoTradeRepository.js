import mongoose from 'mongoose';
import ITradeRepository from '../../../core/domain/repositories/ITradeRepository.js';
import Trade from '../../../core/domain/entities/Trade.js';

/**
 * Trade Schema - Mongoose Model
 */
const TradeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true },
    side: { type: String, enum: ['Long', 'Short'], required: true },
    entry: { type: Number, required: true },
    exit: { type: Number },
    size: { type: Number },
    rr: { type: String },
    pnl: { type: Number, default: 0 },
    status: { type: String, enum: ['Profit', 'Loss', 'Break-even', 'Open'], default: 'Open' },
    mood: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    strategy: { type: String },
    timeframe: { type: String },
    notes: { type: String },
    date: { type: Date, default: Date.now }
});

const TradeModel = mongoose.model('Trade', TradeSchema);

/**
 * MongoTradeRepository - Driven Adapter
 * Implements ITradeRepository using MongoDB.
 */
class MongoTradeRepository extends ITradeRepository {
    async findAllByUserId(userId) {
        const mongoTrades = await TradeModel.find({ userId }).sort({ date: -1 });
        return mongoTrades.map(t => this._toDomain(t));
    }

    async findById(id) {
        const mongoTrade = await TradeModel.findById(id);
        if (!mongoTrade) return null;
        return this._toDomain(mongoTrade);
    }

    async save(tradeEntity) {
        let mongoTrade;
        
        if (tradeEntity.id) {
            // Update existing
            mongoTrade = await TradeModel.findByIdAndUpdate(
                tradeEntity.id, 
                this._toMongoData(tradeEntity),
                { new: true }
            );
        } else {
            // Create new
            mongoTrade = new TradeModel(this._toMongoData(tradeEntity));
            await mongoTrade.save();
        }
        
        return this._toDomain(mongoTrade);
    }

    async delete(id) {
        await TradeModel.findByIdAndDelete(id);
        return true;
    }

    _toDomain(mongoTrade) {
        return new Trade({
            id: mongoTrade._id,
            userId: mongoTrade.userId,
            symbol: mongoTrade.symbol,
            side: mongoTrade.side,
            entry: mongoTrade.entry,
            exit: mongoTrade.exit,
            size: mongoTrade.size,
            rr: mongoTrade.rr,
            pnl: mongoTrade.pnl,
            status: mongoTrade.status,
            mood: mongoTrade.mood,
            rating: mongoTrade.rating,
            strategy: mongoTrade.strategy,
            timeframe: mongoTrade.timeframe,
            notes: mongoTrade.notes,
            date: mongoTrade.date
        });
    }

    _toMongoData(tradeEntity) {
        return {
            userId: tradeEntity.userId,
            symbol: tradeEntity.symbol,
            side: tradeEntity.side,
            entry: tradeEntity.entry,
            exit: tradeEntity.exit,
            size: tradeEntity.size,
            rr: tradeEntity.rr,
            pnl: tradeEntity.pnl,
            status: tradeEntity.status,
            mood: tradeEntity.mood,
            rating: tradeEntity.rating,
            strategy: tradeEntity.strategy,
            timeframe: tradeEntity.timeframe,
            notes: tradeEntity.notes,
            date: tradeEntity.date
        };
    }
}

export default MongoTradeRepository;
export { TradeModel };
