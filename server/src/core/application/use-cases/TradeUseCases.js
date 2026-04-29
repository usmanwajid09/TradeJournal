import Trade from '../../domain/entities/Trade.js';

/**
 * LogTrade Use Case - Application Layer
 * Contains the logic for logging a new trading transaction.
 */
class LogTrade {
    constructor(tradeRepository) {
        this.tradeRepository = tradeRepository;
    }

    async execute(userId, tradeData) {
        // 1. Calculate P&L status if not provided
        const pnl = parseFloat(tradeData.pnl) || 0;
        const status = pnl > 0 ? 'Profit' : (pnl < 0 ? 'Loss' : 'Break-even');

        // 2. Create domain entity
        const tradeEntity = new Trade({
            userId,
            status,
            ...tradeData
        });

        // 3. Save via repository
        return await this.tradeRepository.save(tradeEntity);
    }
}

/**
 * GetTrades Use Case - Application Layer
 */
class GetTrades {
    constructor(tradeRepository) {
        this.tradeRepository = tradeRepository;
    }

    async execute(userId) {
        return await this.tradeRepository.findAllByUserId(userId);
    }
}

/**
 * DeleteTrade Use Case - Application Layer
 */
class DeleteTrade {
    constructor(tradeRepository) {
        this.tradeRepository = tradeRepository;
    }

    async execute(tradeId, userId) {
        // 1. Verify ownership first
        const trade = await this.tradeRepository.findById(tradeId);
        if (!trade) throw new Error('Trade not found');
        if (trade.userId.toString() !== userId.toString()) {
            throw new Error('Unauthorized to delete this trade');
        }

        return await this.tradeRepository.delete(tradeId);
    }
}

/**
 * GetTrade Use Case - Application Layer
 */
class GetTrade {
    constructor(tradeRepository) {
        this.tradeRepository = tradeRepository;
    }

    async execute(tradeId, userId) {
        const trade = await this.tradeRepository.findById(tradeId);
        if (!trade) throw new Error('Trade not found');
        if (trade.userId.toString() !== userId.toString()) {
            throw new Error('Unauthorized to view this trade');
        }
        return trade;
    }
}

/**
 * UpdateTrade Use Case - Application Layer
 */
class UpdateTrade {
    constructor(tradeRepository) {
        this.tradeRepository = tradeRepository;
    }

    async execute(tradeId, userId, updateData) {
        // 1. Verify ownership first
        const trade = await this.tradeRepository.findById(tradeId);
        if (!trade) throw new Error('Trade not found');
        if (trade.userId.toString() !== userId.toString()) {
            throw new Error('Unauthorized to update this trade');
        }

        // 2. Handle status calculation if P&L changed
        if (updateData.pnl !== undefined) {
            const pnl = parseFloat(updateData.pnl) || 0;
            updateData.status = pnl > 0 ? 'Profit' : (pnl < 0 ? 'Loss' : 'Break-even');
        }

        // 3. Create updated entity
        const updatedTrade = new Trade({
            ...trade,
            ...updateData,
            id: tradeId,
            userId: trade.userId // Ensure userId doesn't change
        });

        return await this.tradeRepository.save(updatedTrade);
    }
}

export { LogTrade, GetTrades, DeleteTrade, UpdateTrade, GetTrade };
