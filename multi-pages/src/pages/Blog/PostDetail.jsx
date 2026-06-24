import React, { useEffect, useState } from 'react'
import { data, useParams, useNavigate } from 'react-router'

const PostDetail = () => {

    const { id } = useParams()
    const [post, setPost] = useState(null)
    let navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:3000/posts/${id}`)
            .then(res => res.json())
            .then(data => setPost(data))
    }, [id])

    if (!post) return <div>Carregando...</div>

    return (
        <div className='p-4'>
            <img src={post.image} alt={post.title} />
            <h1 className='text-xl font-bold'>{post.title}</h1>
            <h2>{post.views}</h2>
            <p>{post.description}</p>

            <button className='bg-blue-400 text-white cursor-pointer px-4 py-2 rounded-2xl' onClick={() => navigate(-1)}>
                Voltar
            </button>
        </div>
    )
}

export default PostDetail