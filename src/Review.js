import React from "react";

const Review = (props) => {
	return (
		<div id={props.id} key={props.id}>
			<h3>{props.author}</h3> {props.stars}
			<h4>{props.title}</h4>
			<br />
			<p>{props.review}</p>
			<br />
			{props.date}
			<hr />
		</div>
	);
};
export default Review;
