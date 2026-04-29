/**
 * TradeController - Primary Adapter
 * Drivers for the Trade use cases via HTTP.
 */
class TradeController {
    constructor(logTrade, getTrades, deleteTrade, updateTrade, getTrade) {
        this.logTrade = logTrade;
        this.getTrades = getTrades;
        this.deleteTrade = deleteTrade;
        this.updateTrade = updateTrade;
        this.getTrade = getTrade;
    }

    async create(req, res, next) {
        try {
            // userId comes from authMiddleware (req.user.id)
            const trade = await this.logTrade.execute(req.user.id, req.body);
            res.status(201).json({
                success: true,
                message: 'Trade logged successfully',
                data: trade
            });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const trades = await this.getTrades.execute(req.user.id);
            res.status(200).json({
                success: true,
                data: trades
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const trade = await this.getTrade.execute(req.params.id, req.user.id);
            res.status(200).json({
                success: true,
                data: trade
            });
        } catch (error) {
            next(error);
        }
    }

    async remove(req, res, next) {
        try {
            await this.deleteTrade.execute(req.params.id, req.user.id);
            res.status(200).json({
                success: true,
                message: 'Trade deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const trade = await this.updateTrade.execute(req.params.id, req.user.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Trade updated successfully',
                data: trade
            });
        } catch (error) {
            next(error);
        }
    }
}

export default TradeController;
