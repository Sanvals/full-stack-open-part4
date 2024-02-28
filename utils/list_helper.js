const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const likesList = blogs.map(b => b.likes)
    const total = likesList.reduce((acc, currentValue) => acc + currentValue, 0)
    return total
}

module.exports = {
    dummy,
    totalLikes
}