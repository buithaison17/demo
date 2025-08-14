class Customer {
    id = Number((Math.random() * 1000).toFixed(0));
    name;
    email;
    shippingAddress;
    constructor(name, email, shippingAddress) {
        this.email = email;
        this.name = name;
        this.shippingAddress = shippingAddress;
    }
    getDetails() {
        return `ID: ${this.id}\nTên: ${this.name}\nEmail: ${this.email}\nĐịa chỉ: ${this.shippingAddress}`;
    }
}
class Product {
    id = Number((Math.random() * 1000).toFixed(0));
    name;
    price;
    stock;
    constructor(name, price, stock) {
        this.name = name;
        this.price = price;
        this.stock = stock;
    }
    sell(quantity) {
        if (quantity > 0 && quantity <= this.stock) {
            this.stock -= quantity;
        }
    }
    restock(quantity) {
        if (quantity > 0) {
            this.stock += quantity;
        }
    }
}
class ElectronicsProduct extends Product {
    warrantyPeriod;
    constructor(name, price, stock, warrantyPeriod) {
        super(name, price, stock);
        this.warrantyPeriod = warrantyPeriod;
    }
    getProductInfo() {
        return `ID: ${this.id}
                Tên sản phẩm: ${this.name}
                Giá: ${this.price}
                Hàng tồn kho: ${this.stock}
                Thời gian bảo hành: ${this.warrantyPeriod}
        `;
    }
    getShippingCost(distance) {
        return 50000;
    }
    getCategory() {
        return "Electronics";
    }
}
class ClothingProduct extends Product {
    size;
    color;
    constructor(name, price, stock, size, color) {
        super(name, price, stock);
        this.size = size;
        this.color = color;
    }
    getProductInfo() {
        return `ID: ${this.id}
                Tên sản phẩm: ${this.name}
                Giá: ${this.price}
                Hàng tồn kho: ${this.stock}
                Màu sắc: ${this.color}
                Size: ${this.size}
        `;
    }
    getShippingCost(distance) {
        return 25000;
    }
    getCategory() {
        return "Clothing";
    }
}
class Order {
    orderId = Number((Math.random() * 10000).toFixed(0));
    customer;
    products = [];
    totalAmount;
    constructor(customer, products) {
        this.customer = customer;
        this.products = products;
        this.totalAmount = this.products.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    }
    getDetails() {
        const productList = this.products
            .map((item) => ` - ${item.product.name} x${item.quantity} = ${item.product.price * item.quantity}`)
            .join('\n');
        return `ID: ${this.orderId}
                Khách hàng: ${this.customer.name}
                Sản phẩm: ${productList}
                Tổng giá trị: ${this.totalAmount}
        `;
    }
}
class Store {
    products = [];
    customers = [];
    orders = [];
    findEntityById(collection, id) {
        return collection.find(item => item.id === id);
    }
    addProduct(product) {
        this.products.push(product);
        console.log(`Xem sản phẩm ${product.name} thành công`);
    }
    addCustomer(name, email, address) {
        const newCustomer = new Customer(name, email, address);
        this.customers.push(newCustomer);
        console.log(`Thêm khách hàng ${newCustomer.name} thành công`);
    }
    createOrder(customerId, productQuantities) {
        const customer = this.findEntityById(this.customers, customerId);
        if (!customer) {
            console.log("Khách hàng không tồn tại");
            return null;
        }
        const productInOrder = [];
        for (const pq of productQuantities) {
            const product = this.findEntityById(this.products, pq.productId);
            if (product) {
                if (pq.quantity < product.stock) {
                    product.sell(pq.quantity);
                    productInOrder.push({ product, quantity: pq.quantity });
                }
                else {
                    console.log("Số lượng hàng trong kho không đủ");
                }
            }
            else {
                console.log("Sản phẩm không tồn tại");
            }
        }
        if (productInOrder.length === 0) {
            console.log("Không có sản phẩm hợp lệ để tạo đơn hàng");
            return null;
        }
        const order = new Order(customer, productInOrder);
        this.orders.push(order);
        console.log(`Tạo đơn hàng ${order.orderId} thành công`);
        return order;
    }
    cancelOrder(orderId) {
        const index = this.orders.findIndex(order => order.orderId === orderId);
        if (index !== -1) {
            const order = this.orders[index];
            if (order) {
                order.products.forEach(item => item.product.restock(item.quantity));
                this.orders.splice(index, 1);
            }
        }
    }
    listAvailableProducts() {
        const avavailable = this.products.filter(product => product.stock > 0);
        avavailable.forEach(item => item.getProductInfo());
    }
    listCustomerOrders(customerId) {
        const customerOrders = this.orders.filter(order => order.customer.id === customerId);
        customerOrders.forEach(o => o.getDetails());
    }
    calculateTotalRevenue() {
        return this.orders.reduce((total, order) => total + order.totalAmount, 0);
    }
    updateProductStock(productId, newStock) {
        const product = this.findEntityById(this.products, productId);
        if (product) {
            product.stock = newStock;
            console.log(`Đã cập nhật stock cho sản phẩm ${product.name}`);
        }
        else {
            console.log("Không tìm thấy sản phẩm");
        }
    }
}
const myStore = new Store();
myStore.addCustomer("Nguyen Van A", "a@example.com", "Hà Nội");
myStore.addCustomer("Tran Thi B", "b@example.com", "Hồ Chí Minh");
myStore.addProduct(new ElectronicsProduct("Laptop Dell", 20000000, 10, 24));
myStore.addProduct(new ElectronicsProduct("Điện thoại Samsung", 15000000, 5, 12));
myStore.addProduct(new ClothingProduct("Áo thun nam", 200000, 20, "L", "Xanh"));
myStore.addProduct(new ClothingProduct("Quần jean nữ", 400000, 15, "M", "Đen"));
console.log("\n--- Danh sách sản phẩm còn hàng ---");
console.log(myStore.listAvailableProducts());
export {};
