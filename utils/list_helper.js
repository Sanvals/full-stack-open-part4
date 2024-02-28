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

const mostLikes = (blogs) => {
    const authors = [... new Set(blogs.map(b => b.author))]

    let maxLikes = 0
    
    winner = { author: '', likes: 0 }

    authors.forEach(a => {
        let partTotal = 0
        blogs.map(b => {
            if (b.author === a) {
                partTotal += b.likes
            }
        })

        if (partTotal > maxLikes) {
            maxLikes = partTotal
            winner.likes = partTotal
            winner.author = a
        }
    })

    return winner.author === '' ? null : winner
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}