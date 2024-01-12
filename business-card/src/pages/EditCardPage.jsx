import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Form from '../components/Form'
import AppContext from '../components/context'

const EditCardPage = () => {
	const { isEditForm } = useContext(AppContext)
	const navigate = useNavigate()

	useEffect(() => {
		if (!isEditForm) return navigate('/')
	}, [isEditForm, navigate])

	return (
		<main className='min-h-screen flex justify-center items-center bg-orange-50 py-20 px-5'>
			<div className='flex-shrink-0 w-full max-w-2xl p-5 sm:p-10 rounded-xl bg-orange-100'>
				<h1 className='text-3xl text-center mb-2 font-bold font-mono text-orange-900'>
					Edit Card
				</h1>

				<Form />
			</div>
		</main>
	)
}

export default EditCardPage
