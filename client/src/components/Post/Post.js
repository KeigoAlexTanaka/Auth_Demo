import React from 'react';
import './Post.css';

const Post = props => {
  let { text, id } = props.post;
  return (
    <div className="Post">
      <p>{text}</p>
        <i className="fas fa-retweet"></i>
      <button onClick={e => props.handleDelete(e, id)}>DELETE</button>
    </div>
  )
};

export default Post;