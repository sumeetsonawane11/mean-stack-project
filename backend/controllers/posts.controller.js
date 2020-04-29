const Post = require('../models/post.model');
exports.CreatePost = (req, res, next) => { // POST
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
    });
    console.log(post);
    post.save().then((createdPost) => {
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                ...createdPost,
                id: createdPost._id
            }
        })
    })
        .catch(error => {
            res.status(500).json({
                message: 'Creating the post failed!'
            })
        });
}

exports.GetPosts = (req, res) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    //Post.save() will not execute until we call then() method
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1)) // Skips the first n posts
            .limit(pageSize)
    }
    console.log(req.query)
    postQuery
        .then((documents) => {
            fetchedPosts = documents;
            return Post.countDocuments();
        })
        .then((count) => {
            // console.log(documents);
            res.status(200).json({
                message: 'Posts fetched successfully',
                posts: fetchedPosts,
                maxPosts: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching post failed!'
            })
        });
}

exports.DeletePost = (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
        .then((result) => {
            if (result.n > 0) {
                console.log(result);
                res.status(200).json({
                    message: 'Post Deleted!',
                    posts: result
                });
            } else {
                res.status(401).json({ message: 'Not Authorized!' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching post failed!'
            })
        });
}

exports.UpdatePost =  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {// If we are updating and uploading the other image, it will be file type
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    }
    const post = new Post({ // Image will be string type
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    })
    // While updating , check wether the Post creator is the same user who is updating
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then((updatedPost) => {
        console.log(updatedPost);
        if (updatedPost.n > 0) { // n will tell if something is touched and updated`
            res.status(200).json({ message: 'Update successfully!' });
        } else {
            res.status(401).json({ message: 'Not Authorized!' });
        }
    })
    .catch( error => {
        res.status(500).json({
            message: 'Updating the post failed!'
        })
    });
}

exports.GetPost =  (req, res, next) => {
    Post.findById(req.params.id).then((post) => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(400).json({ 'message': 'Post not found!' });
        }
    })
    .catch( error => {
        res.status(500).json({
            message: 'Fetching post failed!'
        })
    });

}