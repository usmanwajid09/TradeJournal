/**
 * Trade Entity - Domain Layer
 * Represents a trading transaction in the business logic.
 */
class Trade {
    constructor({ 
        id, 
        userId, 
        symbol, 
        side, 
        entry, 
        exit, 
        size, 
        rr, 
        pnl, 
        status, 
        mood, 
        rating, 
        strategy, 
        timeframe, 
        notes, 
        date = new Date() 
    }) {
        this.id = id;
        this.userId = userId;
        this.symbol = symbol;
        this.side = side;
        this.entry = entry;
        this.exit = exit;
        this.size = size;
        this.rr = rr;
        this.pnl = pnl;
        this.status = status;
        this.mood = mood;
        this.rating = rating;
        this.strategy = strategy;
        this.timeframe = timeframe;
        this.notes = notes;
        this.date = date;
    }

    static validate(tradeData) {
        if (!tradeData.userId || !tradeData.symbol || !tradeData.entry) {
            throw new Error('Mandatory trade fields missing (userId, symbol, entry)');
        }
    }
}

export default Trade;
