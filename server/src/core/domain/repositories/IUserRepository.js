/**
 * IUserRepository - Domain Port
 * Defines the contract for user persistence operations.
 * Must be implemented by a driven adapter (e.g., MongoUserRepository).
 */
class IUserRepository {
    async findByEmail(email) {
        throw new Error('Method not implemented');
    }

    async findById(id) {
        throw new Error('Method not implemented');
    }

    async save(user) {
        throw new Error('Method not implemented');
    }
}

export default IUserRepository;
