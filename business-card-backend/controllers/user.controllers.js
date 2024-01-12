const { signUpSchema, signInSchema } = require('../utills/validations.js')
const User = require('../models/user.models.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const salt = parseInt(process.env.SALT_ROUNDS)
const secret = process.env.JWT_SECRET

const signUpController = async (req, res) => {
	try {
		const { name, email, password } = req.body
		const validationResponse = signUpSchema.safeParse({ name, email, password })

		if (!validationResponse.success)
			return res.status(401).json({
				status: 'error',
				message: validationResponse.error.issues[0].message,
			})

		const user = await User.findOne({ email })

		if (user)
			return res
				.status(400)
				.json({ status: 'error', message: 'User already exists.' })

		const hashedPassword = await bcrypt.hash(password, salt)

		const newUser = new User({
			name,
			email,
			password: hashedPassword,
		})

		await newUser.save()

		res.json({ status: 'success', message: 'User created successfully.' })
	} catch (error) {
		console.error(error)

		res.status(500).json({ status: 'error', message: 'something went wrong' })
	}
}

const signInController = async (req, res) => {
	try {
		const { email, password } = req.body
		const validationResponse = signInSchema.safeParse({ email, password })

		if (!validationResponse.success)
			return res.status(401).json({
				status: 'error',
				message: validationResponse.error.issues[0].message,
			})

		const user = await User.findOne({ email }).select('+password')

		if (!user)
			return res
				.status(400)
				.json({ status: 'error', message: 'User not found.' })

		const passwordMatch = await bcrypt.compare(password, user?.password)

		if (!passwordMatch)
			return res
				.status(403)
				.json({ status: 'error', message: 'Incorrect password' })

		const token = jwt.sign(
			{
				name: user.name,
				email,
				id: user._id.toString(),
			},
			secret,
			{ expiresIn: '30d' },
		)

		res.json({ status: 'success', message: 'successfully signed in.', token })
	} catch (error) {
		console.error(error)

		res.status(500).json({ status: 'error', message: 'something went wrong' })
	}
}

module.exports = {
	signUpController,
	signInController,
}
