const bcrypt = require('bcrypt');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

module.exports = {
    createUser: async args => {
        const { email, password } = args.userInput;
        try {
            const savedUser = await User.findOne({ email });
            if (savedUser)
                throw new Error('User exists already!');

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({
                email,
                password: hashedPassword
            });
            const response = await user.save();
            return {
                ...response._doc,
                password: null,
                _id: response.id
            };
        }catch(err) {
            throw err;
        }
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email });
        if (!user)
            throw new Error('User doesnt exist!');

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual)
            throw new Error('Password is incorrect!');

        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.SECRET_TOKEN, {
            expiresIn: '1h'
        });

        return {
            iserId: user.id,
            token,
            tokenExpiration: 1 // 1 hour
        }
    }
}