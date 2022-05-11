const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/bookModel");
const mongoose = require("mongoose");

const createReview = async function (req, res) {
  try {
    //reading bookid from path
    const _id = req.params.bookId;

    //id format validation
    if (_id) {
      if (mongoose.Types.ObjectId.isValid(_id) == false) {
        return res
          .status(400)
          .send({ status: false, message: "userId Invalid" });
      }
    }

    //fetch book with bookId
    const book = await bookModel.findOne({
      $and: [{ _id }, { isDeleted: false }],
    });

    //no books found
    if (!book) {
      return res.status(200).send({ status: true, data: "book not found" });
    }

    //reading request body
    const body = req.body;
    const { reviewedAt, reviewedBy, rating } = body;

    let arr = Object.keys(body);

    //if empty request body
    if (arr.length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide input" });
    }

    //mandatory fields
    if (!reviewedBy) {
      return res
        .status(400)
        .send({ status: false, message: "reviewer name is required" });
    }

    if (!rating) {
      return res
        .status(400)
        .send({ status: false, message: "rating is required" });
    }

    //rating validation
    const validRating = /^([1-5]|1[05])$/.test(rating);
    if (!validRating) {
      return res.status(400).send({
        status: false,
        message: "Invalid rating - rating should be between 1 to 5",
      });
    }

    //assign bookId from path
    body.bookId = _id;
    //create review
    const review = await reviewModel.create(body);
    const updatedBook = await bookModel.findByIdAndUpdate(
      { _id },
      { $inc: { reviews: 1 } },
      { new: true }
    );

    const reviewedBook = {
      _id: updatedBook._id,
      title: updatedBook.title,
      excerpt: updatedBook.excerpt,
      userId: updatedBook.userId,
      ISBN: updatedBook.ISBN,
      category: updatedBook.category,
      subcategory: updatedBook.subcategory,
      deletedAt: updatedBook.deletedAt,
      review: updatedBook.reviews,
      isDeleted: updatedBook.isDeleted,
      releasedAt: updatedBook.releasedAt,
      createdAt: updatedBook.createdAt,
      updatedAt: updatedBook.updatedAt,
      reviewsData: review,
    };

    res
      .status(200)
      .send({ status: true, message: "Success", data: reviewedBook });
  } catch (err) {
    res.status(500).send({
      status: false,
      Error: "Server not responding",
      msg: err.message,
    });
  }
};

const updateReview = async function (req, res) {
  try {
    //reading bookid from path
    const _id = req.params.bookId;

    //id format validation
    if (_id) {
      if (mongoose.Types.ObjectId.isValid(_id) == false) {
        return res
          .status(400)
          .send({ status: false, message: "userId Invalid" });
      }
    }

    //fetch book with bookId
    const book = await bookModel.findOne({
      $and: [{ _id }, { isDeleted: false }],
    });

    //no books found
    if (!book) {
      return res.status(200).send({ status: true, data: "book not found" });
    }

    //reading reviewId form path
    const reviewId = req.params.reviewId;
    //id format validation
    if (reviewId) {
      if (mongoose.Types.ObjectId.isValid(reviewId) == false) {
        return res
          .status(400)
          .send({ status: false, message: "userId Invalid" });
      }
    }

    //fetch review with reviewId
    const oldReview = await reviewModel.findOne({
      $and: [{ _id: reviewId }, { isDeleted: false }],
    });

    //no books found
    if (!oldReview) {
      return res.status(200).send({ status: true, data: "review not found" });
    }

    //reading request body
    const body = req.body;
    const { review, reviewedBy, rating } = body;

    let arr = Object.keys(body);

    //if empty request body
    if (arr.length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide input" });
    }

    //date format
    const date = new Date().toISOString();

    const updatedReview = await reviewModel.findByIdAndUpdate(
      { _id: reviewId },
      { body, reviewedAt: date },
      { new: true }
    );
    const updatedBook = await bookModel.findById({ _id });

    const reviewedBook = {
      _id: updatedBook._id,
      title: updatedBook.title,
      excerpt: updatedBook.excerpt,
      userId: updatedBook.userId,
      ISBN: updatedBook.ISBN,
      category: updatedBook.category,
      subcategory: updatedBook.subcategory,
      deletedAt: updatedBook.deletedAt,
      review: updatedBook.reviews,
      isDeleted: updatedBook.isDeleted,
      releasedAt: updatedBook.releasedAt,
      createdAt: updatedBook.createdAt,
      updatedAt: updatedBook.updatedAt,
      reviewsData: updatedReview,
    };

    res
      .status(200)
      .send({ status: true, message: "Success", data: reviewedBook });
  } catch (err) {
    res.status(500).send({
      status: false,
      Error: "Server not responding",
      msg: err.message,
    });
  }
};

const deleteReview = async function (req, res) {
  try {
    //reading bookid from path
    const _id = req.params.bookId;

    //id format validation
    if (_id) {
      if (mongoose.Types.ObjectId.isValid(_id) == false) {
        return res
          .status(400)
          .send({ status: false, message: "userId Invalid" });
      }
    }

    //fetch book with bookId
    const book = await bookModel.findOne({
      $and: [{ _id }, { isDeleted: false }],
    });

    //no books found
    if (!book) {
      return res.status(200).send({ status: true, data: "book not found" });
    }

    //reading reviewId form path
    const reviewId = req.params.reviewId;
    //id format validation
    if (reviewId) {
      if (mongoose.Types.ObjectId.isValid(reviewId) == false) {
        return res
          .status(400)
          .send({ status: false, message: "userId Invalid" });
      }
    }

    //fetch review with reviewId
    const oldReview = await reviewModel.findOne({
      $and: [{ _id: reviewId }, { isDeleted: false }],
    });

    //no books found
    if (!oldReview) {
      return res.status(200).send({ status: true, data: "review not found" });
    }

    //delete Review
    const deleteReview = await reviewModel.findByIdAndUpdate(
      { _id: reviewId },
      { $set: { isDeleted: true } },
      { new: true }
    );

    //decrease review count
    const updateReviewCount = await bookModel.findByIdAndUpdate(
      { _id },
      { $inc: { reveiws: -1 } },
      { new: true }
    );

    //new object for updated book
    const updatedBook = {
      _id: updateReviewCount._id,
      title: updateReviewCount.title,
      excerpt: updateReviewCount.excerpt,
      userId: updateReviewCount.userId,
      ISBN: updateReviewCount.ISBN,
      category: updateReviewCount.category,
      subcategory: updateReviewCount.subcategory,
      deletedAt: updateReviewCount.deletedAt,
      review: updateReviewCount.reviews,
      isDeleted: updateReviewCount.isDeleted,
      releasedAt: updateReviewCount.releasedAt,
      createdAt: updateReviewCount.createdAt,
      updatedAt: updateReviewCount.updatedAt,
      reviewsData: deleteReview,
    };

    res
      .status(200)
      .send({ status: true, message: "Success", data: updatedBook });
  } catch (err) {
    res.status(500).send({
      status: false,
      Error: "Server not responding",
      msg: err.message,
    });
  }
};

module.exports = { createReview, updateReview, deleteReview };