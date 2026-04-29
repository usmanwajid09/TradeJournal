/**
 * User Entity - Domain Layer
 * Represents the fundamental user model in the business logic.
 */
class User {
    constructor({ id, name, email, password, role = 'Trader', createdAt = new Date() }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt;
    }

    static validate(userData) {
        if (!userData.email || !userData.password) {
            throw new Error('Email and password are required for a User entity');
        }
    }
}

export default User;
