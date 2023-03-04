const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const homeController = require('../app/http/controllers/homeController')
const AdminOrderController = require('../app/http/controllers/admin/orderController')


//Middlewares
const admin = require('../app/http/middlewares/admin')
const auth = require('../app/http/middlewares/auth')
const guest = require('../app/http/middlewares/guest')


function initRoutes(app) {

    app.get('/', homeController().index)

    app.get('/cart', cartController().index)
    
    app.get('/login', guest, authController().login)

    app.post('/login', authController().postLogin)
    
    app.get('/register', guest, authController().register)

    app.post('/register', authController().postRegister)

    app.post('/logout', authController().logout)

    app.post('/update-cart', cartController().update)

    //Customers Routes

    app.post('/orders',auth, orderController().store)

    app.get('/customers/orders',auth, orderController().index)

    //Admin Routes

    app.get('/admin/orders',admin, AdminOrderController().index)

}

module.exports = initRoutes