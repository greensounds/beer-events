import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import Layout from '@/components/Layout'
import {API_URL} from '@/config/index'
import styles from '@/styles/Form.module.css'
import { parseCookies } from '@/helpers/index'

export default function AddEventPage ({token}) {
    const [values, setValues] = useState({
        name: '',
        breweries: '',
        venue: '',
        address: '',
        date: '',
        time: '',
        description: '',
    })
    
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault();
        //validation
        const hasEmptyFields = Object.values(values).some((element) => element === '') 

        if(hasEmptyFields) {
            toast.error('Please fill all')
        }

        const res = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(values)
        })

        if(!res.ok) {
            if(res.status === 403 || res.status === 401) {
                toast.error('No token included')
                return
            }
            toast.error('Something went wrong')
        } else {
            const evt = await res.json()
            router.push(`/events/${evt.slug}`)
        }
    }

    const handleInputChange = (e) => {
        e.preventDefault()
        const { name, value } = e.target;
        setValues({...values, [name]: value})
    }

    return(
        <Layout>
            <Link href='/events'>Go back</Link>
            <h1>Add Event</h1>
            <ToastContainer />
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.grid}>
                <div>
                    <label htmlFor='name'>Event Name</label>
                    <input
                    type='text'
                    id='name'
                    name='name'
                    value={values.name}
                    onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor='breweries'>Breweries</label>
                    <input
                    type='text'
                    name='breweries'
                    id='breweries'
                    value={values.breweries}
                    onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor='venue'>Venue</label>
                    <input
                    type='text'
                    name='venue'
                    id='venue'
                    value={values.venue}
                    onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor='address'>Address</label>
                    <input
                    type='text'
                    name='address'
                    id='address'
                    value={values.address}
                    onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor='date'>Date</label>
                    <input
                    type='date'
                    name='date'
                    id='date'
                    value={values.date}
                    onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor='time'>Time</label>
                    <input
                    type='text'
                    name='time'
                    id='time'
                    value={values.time}
                    onChange={handleInputChange}
                    />
                </div>
                </div>

                <div>
                <label htmlFor='description'>Event Description</label>
                <textarea
                    type='text'
                    name='description'
                    id='description'
                    value={values.description}
                    onChange={handleInputChange}
                ></textarea>
                </div>

                <input type='submit' value='Add Event' className='btn' />
            </form>
        </Layout>
    )
}

export async function getServerSideProps({req}) {
    const {token} = parseCookies(req)
    return {
        props: {
            token
        }
    }
}