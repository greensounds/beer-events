import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import Layout from '@/components/Layout'
import {API_URL} from '@/config/index'
import styles from '@/styles/Form.module.css'
import moment from 'moment'
import Image from 'next/image'
import {FaImage} from 'react-icons/fa'
import Modal from '@/components/Modal'
import ImageUpload from '@/components/ImageUpload'
import { parseCookies } from '@/helpers/index'

export default function EditEventPage ({evt, token}) {
    const [values, setValues] = useState({
        name: evt.name,
        breweries: evt.breweries,
        venue: evt.venue,
        address: evt.address,
        date: evt.date,
        time: evt.time,
        description: evt.description,
    })

    const [imagePreview, setImagePreview] = useState(evt.image ? evt.image.formats.thumbnail.url: null );
    const [showModal, setShowModal] = useState(false)
    
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault();
        //validation
        const hasEmptyFields = Object.values(values).some((element) => element === '') 

        if(hasEmptyFields) {
            toast.error('Please fill all')
        }

        const res = await fetch(`${API_URL}/events/${evt.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(values)
        })

        if(!res.ok) {
            if(res.status === 403 || res.status === 401) {
                toast.error('Unauthorized')
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

    const imageUploaded = async (e) => {
        const res = await fetch(`${API_URL}/events/${evt.id}`)
        const data = await res.json()
        setImagePreview(data.image.formats.thumbnail.url)
        console.log(data)
        setShowModal(false)
      }

    return(
        <Layout>
            <Link href='/events'>Go back</Link>
            <h1>Edit Event</h1>
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
                    value={moment(values.date).format('yyyy-MM-DD')}
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

                <input type='submit' value='Update Event' className='btn' />
            </form>
            <h2>Event Image</h2>
            {imagePreview ? (
                <Image src={imagePreview} height={100} width={170} />
            ) : (<div>
                <p>No image uploaded</p>    
            </div>)}
            <div>
                <button onClick={() => setShowModal(true)} className="btn-secondary">
                    <FaImage /> Set Image
                </button>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <ImageUpload evtId={evt.id} imageUploaded={imageUploaded} token={token} />
            </Modal>
        </Layout>
    )
}

export async function getServerSideProps({params: {id}, req}) {
    const {token} = parseCookies(req)
    const res = await fetch(`${API_URL}/events/${id}`)
    const evt = await res.json()

    //console.log(req.headers.cookie)

    return {
        props: {
            evt,
            token
        }
    }
}