const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const likesList = blogs.map(b => b.likes)
    const total = likesList.reduce((acc, currentValue) => acc + currentValue, 0)
    return total
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) { 
        return null
    }

    const winner = blogs.reduce((acc, current) => current.likes > acc.likes ? current : acc, blogs[0])
    
    return { title: winner.title,
            author: winner.author,
            likes: winner.likes
            }
}

const mostBlogs = (blogs) => {
    const authorsList = blogs.map(b => b.author)

    const winner = {
        author : '',
        blogs: 0
    }

    authorsList.forEach(a => {
        const compa = authorsList.filter(b => b == a).length
        if (compa > winner.blogs) {
            winner.author = a
            winner.blogs = compa
        }
    })

    return winner.author === '' ? null : winner
    
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
}