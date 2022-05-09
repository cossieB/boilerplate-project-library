/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');
const Books = require('../model')

module.exports = function (app) {

    app.route('/api/books')
        .get(async function (req, res) {
            //response will be array of book objects
            //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

            const books = await Books.find().select(['_id', 'title', 'commentcount']).exec()
            res.json([...books])
        })

        .post(async function (req, res) {
            let title = req.body.title;
            //response will contain new book object including atleast _id and title
            if (!title) return res.send('missing required field title')
            const book = new Books({ title })
            await book.save()
            res.json({_id: book._id, title})
        })

        .delete(async function (req, res) {
            //if successful response will be 'complete delete successful'
            const response = await Books.deleteMany()

            if (res.aknowledged) {
                return res.send('complete delete successful')
            }
            else {
                return res.send('something went wrong')
            }
        });



    app.route('/api/books/:id')
        .get(async function (req, res) {
            let bookid = req.params.id;
            //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
            const book = await Books.findById(bookid).select(['_id', 'title', 'comments']).exec().catch(() => null)
            if (!book) return res.send('no book exists')
            
            res.json({...book._doc})
        })
        
        .post(async function (req, res) {
            let bookid = req.params.id;
            let comment = req.body.comment;
            //json res format same as .get
            if (!comment) return res.send('missing required field comment')
            
            const response = await Books.findByIdAndUpdate(bookid, {
                $push: {comments: comment},
                $inc: {commentcount: 1}
            }, 
            {new: true}
            ).catch(() => null)

            if (response === null) return res.send('no book exists')
            res.json({...response. _doc})
        })

        .delete(async function (req, res) {
            let bookid = req.params.id;
            //if successful response will be 'delete successful'
            const response =  await Books.findByIdAndDelete(bookid).catch(() => null)
            
            if (!response) return res.send('no book exists')
            return res.send('delete successful')
        });
};
