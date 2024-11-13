const {v4: uuidv4} = require('uuid');

const boards = [
    {
        id: '1',
        title: 'Thrasher Board',
        seller: 'Drew',
        condition: 'New',
        price: 59.99,
        details: 'New condition board with a classic design.',
        image: '/images/thrasher.jpg',
        active: true,
        offers: 5
    },
    {
        id: '2',
        title: 'Santa Cruz Board',
        seller: 'Allie',
        condition: 'Like New',
        price: 49.99,
        details: 'A top-notch skateboard from Santa Cruz.',
        image: '/images/santa.jpg',
        active: true,
        offers: 3
    },
    {
        id: '3',
        title: 'Rip N Dip Board',
        seller: 'Michael',
        condition: 'Good',
        price: 29.99,
        details: 'A fun Rip N Dip skateboard with unique artwork.',
        image: '/images/ripndip.jpg',
        active: true,
        offers: 12
    },
    {
        id: '4',
        title: 'Arizona Board',
        seller: 'Kate',
        condition: 'Mint',
        price: 79.99,
        details: 'An eye-catching skateboard featuring Arizona Iced Tea design.',
        image: '/images/arizona.jpg',
        active: true,
        offers: 2
    },
    {
        id: '5',
        title: 'Baker Board',
        seller: 'Kylie',
        condition: 'Wear',
        price: 19.99,
        details: 'A classic skateboard from Baker with signs of wear.',
        image: '/images/baker.jpg',
        active: true,
        offers: 0
    },
    {
        id: '6',
        title: 'Birdhouse Board',
        seller: 'Donatello',
        condition: 'New',
        price: 39.99,
        details: 'A high-performance skateboard from Birdhouse.',
        image: '/images/birdhouse.jpg',
        active: true,
        offers: 1
    }
];

exports.find = () => boards;

exports.findById = id => boards.find(board=>board.id === id);

exports.save = (board) =>{
    board.id = uuidv4();
    board.offers = 0;
    board.active = true;
    boards.push(board);
};

exports.updateById = (id, newboard) =>{
    let board = boards.find(board=>board.id === id)
    if(board) {
        board.title = newboard.title;
        board.condition = newboard.condition;
        board.price = newboard.price;
        board.details = newboard.details;

        if (newboard.image) {
            board.image = newboard.image;
        }
        return true;
    } else {
        return false;
    }
};

exports.deleteById = function(id) {
    let index = boards.findIndex(board =>board.id === id);
    if(index !== -1) {
        boards.splice(index, 1);
        return true;
    } else {
        return false;
    }
}