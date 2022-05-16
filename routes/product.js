const res = require("express/lib/response");
const Product = require("../models/Product");
const router = require("express").Router();

//CREATE
router.post("/add-product", async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json(err)
    }
});


//Update
router.post("/edit-product", async (req, res) => {
    try {
        const updatedProdcut = await Product.findByIdAndUpdate(
            req.body.product_id,
            {
                $set: {
                    title: req.body.title,
                    desc: req.body.desc,
                    img: req.body.img,
                    categories: req.body.categories,
                    size: req.body.size,
                    color: req.body.color,
                    price: req.body.price
                }
            },
            { new: true }
        );
        res.status(200).json(updatedProdcut);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Delete
router.delete("/delete-product/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted")
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get Prodcut
router.get("/get-product/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get All Products
router.get("/get-all", async (req, res) => {
    const qNew = req.query.new
    const qCategory = req.query.category;
    try {
        let products;
        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5)
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/app-events", async (req, res) => {
    const { event, data } = req.body.payload;

    switch (event) {
        case 'GET_PRODUCT':
            const { product_id } = data;
            try {
                const product = await Product.findById(product_id);
                res.status(200).json({ data: product, success: true });
            } catch (err) {
                res.status(500).json({ err: err, success: false })
            }
        default:
            res.status(500).json({ msg: 'Invalid Event', success: false })
            break;
    }
});


module.exports = router; 