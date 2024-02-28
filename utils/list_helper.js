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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}