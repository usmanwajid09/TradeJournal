/**
 * ITradeRepository - Domain Port
 * Defines the contract for trade persistence operations.
 */
class ITradeRepository {
    async findAllByUserId(userId) {
        throw new Error('Method not implemented');
    }

    async findById(id) {
        throw new Error('Method not implemented');
    }

    async save(trade) {
        throw new Error('Method not implemented');
    }

    async delete(id) {
        throw new Error('Method not implemented');
    }
}

export default ITradeRepository;
