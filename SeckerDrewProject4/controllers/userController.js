const model = require('../models/user');
const Board = require('../models/board');
//User controller
exports.new = (req, res)=>{
    req.flash('success', 'User created successfully');
    return res.render('./user/new');
};

exports.create = (req, res, next)=>{
    let user = new model(req.body);
    user.save()
    .then(user=> res.redirect('/users/login'))
    .catch(err=>{ //Error Handling
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('/users/new');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email has been used');  
            return res.redirect('/users/new');
        }
        
        next(err);
    }); 
};

exports.getUserLogin = (req, res, next) => {
    return res.render('./user/login');
}

exports.login = (req, res, next)=>{
    let email = req.body.email;
    let password = req.body.password;
    model.findOne({ email: email })
    .then(user => {
        if (!user) {
            req.flash('error', 'wrong email address');  
            res.redirect('/users/login');
            } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
            } else { //Error handling
                req.flash('error', 'wrong password');      
                res.redirect('/users/login');
            }
            });     
        }     
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    Promise.all([model.findById(id), Board.find({seller: id})]) 
    .then(results=>{
        const [user, boards] = results;
        res.render('./user/profile', {user, boards})
    })
    .catch(err=>next(err));
};


exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) { //Error handling
            req.flash('error', err.message);
            return next(err);
        } else {
            res.redirect('/');  
        }   
    });
};