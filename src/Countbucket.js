import React from 'react';
import Review from './Review'


const Countbucket = props => {
    return(
        <div>
            <h2>{props.Month} {props.Year}</h2>
            {props.array.length > 0 && 
      props.array.map(userReviews => (
        <div>
          <Review author={userReviews.author} review= {userReviews.review} stars={userReviews.stars} id={userReviews.id} date={userReviews.date} title={userReviews.title}/>
        </div>
        ))}
        </div>
    )
}

export default Countbucket;
