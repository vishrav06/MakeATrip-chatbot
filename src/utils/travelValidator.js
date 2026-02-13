// Keywords that indicate travel-related queries
const TRAVEL_KEYWORDS = [
'travel', 'trip', 'destination', 'hotel', 'flight', 'visit',
'vacation', 'tourism', 'tourist', 'booking', 'airport',
'city', 'country', 'beach', 'mountain', 'attraction',
'restaurant', 'food', 'culture', 'transport', 'weather',
'train', 'bus', 'car rental', 'cruise', 'resort', 'tour',
'sightseeing', 'itinerary', 'backpacking', 'adventure'
];

// Keywords that strongly indicate non-travel queries
const NON_TRAVEL_INDICATORS = [
'math', 'calculate', 'code', 'programming', 'javascript',
'python', 'recipe', 'health', 'medical', 'political',
'sports score', 'stock market', 'cryptocurrency'
];


function isLikelyTravelQuery(message){
    const lower = message.toLowerCase();
    

    for(const keyword of NON_TRAVEL_INDICATORS){
        if(lower.includes(keyword)){
            return false;
        }
    }

    for(const keyword of TRAVEL_KEYWORDS){
        if(lower.includes(keyword)){
            return true;
        }
    }

    return null;
}

module.exports = {isLikelyTravelQuery};