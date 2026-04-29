import User from '../../domain/entities/User.js';

/**
 * RegisterUser Use Case - Application Layer
 * Contains the logic for registering a new trader.
 */
class RegisterUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({ name, email, password }) {
        // 1. Check if user already exists
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User with this email already exists.');
        }

        // 2. Create domain entity (validation happens in constructor)
        const userEntity = new User({ name, email, password });

        // 3. Save via repositoryport
        return await this.userRepository.save(userEntity);
    }
}

export default RegisterUser;
