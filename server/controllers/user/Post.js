const { default: mongoose } = require('mongoose');
const Post = require('../../models/Post');
const User = require('../../models/User');

exports.createPost = async (req, res) => {
  try {
    let post;
    if (req.body.type !== null) {
      post = await new Post({ ...req.body, approve: true }).save();
      await post.populate(
        'user',
        'first_name last_name username picture cover'
      );
    } else {
      post = await new Post(req.body).save();
      await post.populate(
        'user',
        'first_name last_name username picture cover'
      );
    }
    res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const followingTemp = await User.findById(req.user.id).select('following');
    const following = followingTemp.following;
    const promises = following.map((user) => {
      return Post.find({
        user: user,
        approve: true,
      })
        .populate('user', 'first_name last_name username picture cover')
        .populate('comments.commentBy', 'first_name last_name username picture')
        .sort({ createdAt: -1 })
        .limit(10);
    });
    const followingPost = await (await Promise.all(promises)).flat();

    const userPost = await Post.find({
      user: req.user.id,
      approve: true,
    })
      .populate('user', 'first_name last_name username picture cover')
      .populate('comments.commentBy', 'first_name last_name username picture')
      .sort({ createdAt: -1 })
      .limit(10);

    followingPost.push(...[...userPost]);
    followingPost.sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json(followingPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.comment = async (req, res) => {
  try {
    const { comment, postId, image } = req.body;
    let newComments = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            comment,
            images: image,
            commentBy: req.user.id,
            commentAt: new Date(),
          },
        },
      },
      {
        new: true,
      }
    ).populate('comments.commentBy', 'picture first_name last_name username');

    res.status(200).json(newComments.comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.hideComment = async (req, res) => {
  try {
    const { commentId } = req.body;

    await Post.updateMany(
      {},
      { $set: { 'comments.$[elem].hide': true } },
      {
        arrayFilters: [
          { 'elem._id': { $eq: mongoose.Types.ObjectId(commentId) } },
        ],
      }
    );

    const getCommentUpdate = await Post.findOne({
      'comments._id': mongoose.Types.ObjectId(commentId),
    })
      .select('comments')
      .populate('comments.commentBy', 'picture first_name last_name username');

    res.status(200).json(getCommentUpdate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.showComment = async (req, res) => {
  try {
    const { commentId } = req.body;

    await Post.updateMany(
      {},
      { $set: { 'comments.$[elem].hide': false } },
      {
        arrayFilters: [
          { 'elem._id': { $eq: mongoose.Types.ObjectId(commentId) } },
        ],
      }
    );

    const getCommentUpdate = await Post.findOne({
      'comments._id': mongoose.Types.ObjectId(commentId),
    })
      .select('comments')
      .populate('comments.commentBy', 'picture first_name last_name username');

    res.status(200).json(getCommentUpdate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId, postId } = req.body;

    const del = await Post.updateOne(
      { _id: mongoose.Types.ObjectId(postId) },
      { $pull: { comments: { _id: mongoose.Types.ObjectId(commentId) } } }
    );

    if (del.acknowledged) {
      res.status(200).json({ status: true });
    } else {
      res.status(400).json({ status: false });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.savePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const postUserId = req.body.postUserId;
    const user = await User.findById(req.user.id);

    const check = user?.savedPosts.find(
      (post) => post.post.toString() === postId
    );

    if (check) {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: {
          savedPosts: { _id: check._id },
        },
      });
    } else {
      await User.findByIdAndUpdate(
        req.user.id,
        {
          $push: {
            savedPosts: {
              post: postId,
              postBy: postUserId,
              savedAt: new Date(),
            },
          },
        },
        {
          new: true,
        }
      );
    }
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllSavedPosts = async (req, res) => {
  try {
    const savedPosts = await User.findById(req.user.id)
      .select('savedPosts')
      .populate('savedPosts.post', 'text images videos background')
      .populate('savedPosts.postBy', 'first_name last_name picture username')
      .lean();

    res.status(200).json(savedPosts.savedPosts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getOneSavedPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId)
      .populate('user', 'first_name last_name username picture')
      .populate('comments.commentBy', 'first_name last_name username picture');
    res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndRemove(req.params.id);
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
