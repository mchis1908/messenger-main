export const apiKey = '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';
// in some cases your api key maybe already expired
// try to use a new account to create an api key

export const dummyMessages = [
    {
        role: 'user', 
        content: 'How are you?'
    },
    {
        role: 'assistant',
        content: "I'm fine, How may i help you today."
    },
    {
        role: 'user',
        content: 'create an image of a dog playing with cat'
    },
    {
        role: 'assistant',
        content: 'https://storage.googleapis.com/pai-images/ae74b3002bfe4b538493ca7aedb6a300.jpeg'
    }
]

export const timeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - timestamp) / 1000);
    const intervals = Math.floor(seconds / 31536000);
    
    if (intervals > 1) {
        return `${intervals} years ago`;
    }
    if (intervals === 1) {
        return `${intervals} year ago`;
    }
    
    const intervalsMonths = Math.floor(seconds / 2592000);
    if (intervalsMonths > 1) {
        return `${intervalsMonths} months ago`;
    }
    if (intervalsMonths === 1) {
        return `${intervalsMonths} month ago`;
    }
    
    const intervalsDays = Math.floor(seconds / 86400);
    if (intervalsDays > 1) {
        return `${intervalsDays} days ago`;
    }
    if (intervalsDays === 1) {
        return `${intervalsDays} day ago`;
    }
    
    const intervalsHours = Math.floor(seconds / 3600);
    if (intervalsHours > 1) {
        return `${intervalsHours} hours ago`;
    }
    if (intervalsHours === 1) {
        return `${intervalsHours} hour ago`;
    }
    
    const intervalsMinutes = Math.floor(seconds / 60);
    if (intervalsMinutes > 1) {
        return `${intervalsMinutes} minutes ago`;
    }
    if (intervalsMinutes === 1) {
        return `${intervalsMinutes} minute ago`;
    }
    
    return "Just now";
}