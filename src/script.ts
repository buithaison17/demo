class Customer {
    id: number = Number((Math.random()*1000).toFixed(0));
    name: string;
    email: string;
    shippingAddress: string;
    constructor(name: string, email: string, shippingAddress: string){
        this.email = email;
        this.name = name;
        this.shippingAddress = shippingAddress;
    }
    getDetails(): string{
        return `ID: ${this.id}\nTên: ${this.name}\nEmail: ${this.email}\nĐịa chỉ: ${this.shippingAddress}`
    }
}

abstract class Product {
    id: number = Number((Math.random()*1000).toFixed(0));
    name: string;
    price: number;
    stock: number;
    constructor(name: string, price: number, stock: number){
        this.name = name;
        this.price = price;
        this.stock = stock;
    }
    sell(quantity: number): void {
        if(quantity > 0 && quantity <= this.stock){
            this.stock -= quantity;
        }
    }
    restock(quantity: number): void{
        if(quantity > 0){
            this.stock += quantity;
        }
    }
    abstract getProductInfo(): string;
    abstract getShippingCost(distance: number): number;
    abstract getCategory(): string;
}

class ElectronicsProduct extends Product {
    warrantyPeriod: number;
    constructor(name: string, price: number, stock: number, warrantyPeriod: number){
        super(name, price, stock);
        this.warrantyPeriod = warrantyPeriod
    }
    getProductInfo(): string {
        return `ID: ${this.id}
                Tên sản phẩm: ${this.name}
                Giá: ${this.price}
                Hàng tồn kho: ${this.stock}
                Thời gian bảo hành: ${this.warrantyPeriod}
        `
    }
    getShippingCost(distance: number): number {
        return 50000;
    }
    getCategory(): string {
        return "Electronics";
    }
}

class ClothingProduct extends Product {
    size: string;
    color: string;
    constructor(name: string, price: number, stock: number, size: string, color: string){
        super(name, price, stock);
        this.size = size;
        this.color = color;
    }
    getProductInfo(): string {
        return `ID: ${this.id}
                Tên sản phẩm: ${this.name}
                Giá: ${this.price}
                Hàng tồn kho: ${this.stock}
                Màu sắc: ${this.color}
                Size: ${this.size}
        `
    }
    getShippingCost(distance: number): number {
        return 25000;
    }
    getCategory(): string {
        return "Clothing"
    }
}

class Order {
    orderId: number = Number((Math.random()*10000).toFixed(0));
    customer: Customer;
    products: {product: Product, quantity: number}[] = [];
    totalAmount: number;
    constructor(customer: Customer, products: {product: Product, quantity: number}[]){
        this.customer = customer;
        this.products = products;
        this.totalAmount = this.products.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    }

    getDetails(): string{
        const productList = this.products
            .map(
                (item) =>
                    ` - ${item.product.name} x${item.quantity} = ${item.product.price * item.quantity}`
            )
            .join('\n');
        return `ID: ${this.orderId}
                Khách hàng: ${this.customer.name}
                Sản phẩm: ${productList}
                Tổng giá trị: ${this.totalAmount}
        `
    }
}

class Store {
    products: Product[] = [];
    customers: Customer[] = [];
    orders: Order[] = [];
    findEntityById<T extends {id: number}>(collection: T[], id: number): T | undefined {
        return collection.find(item => item.id === id);
    } 
    addProduct(product: Product): void{
        this.products.push(product);
        console.log(`Xem sản phẩm ${product.name} thành công`);
    }
    addCustomer(name: string, email: string, address: string): void{
        const newCustomer = new Customer(name, email, address);
        this.customers.push(newCustomer);
        console.log(`Thêm khách hàng ${newCustomer.name} thành công`);
    }
    createOrder(customerId: number, productQuantities: { productId: number, quantity: number }[]): Order | null {
        const customer = this.findEntityById(this.customers, customerId);
        if(!customer){
            console.log("Khách hàng không tồn tại");
            return null;
        }
        const productInOrder: {product: Product, quantity: number}[] = [];
        for (const pq of productQuantities) {
            const product = this.findEntityById(this.products, pq.productId);
            if(product){
                if(pq.quantity < product.stock){
                    product.sell(pq.quantity);
                    productInOrder.push({product, quantity: pq.quantity});
                }
                else{
                    console.log("Số lượng hàng trong kho không đủ");
                }
            }
            else{
                console.log("Sản phẩm không tồn tại");
            }
        }
        if(productInOrder.length === 0){
            console.log("Không có sản phẩm hợp lệ để tạo đơn hàng");
            return null;
        }
        const order = new Order(customer, productInOrder);
        this.orders.push(order);
        console.log(`Tạo đơn hàng ${order.orderId} thành công`);
        return order;
    }
    cancelOrder(orderId: number): void{
        const index = this.orders.findIndex(order => order.orderId === orderId);
        if(index !== -1){
            const order = this.orders[index];
            if(order){
                order.products.forEach(item => item.product.restock(item.quantity));
                this.orders.splice(index, 1);
            }
        }        
    }
    listAvailableProducts(): void {
        const avavailable = this.products.filter(product => product.stock > 0);
        avavailable.forEach(item => console.log(item.getProductInfo()));
    }
    listCustomerOrders(customerId: number): void {
        const customerOrders = this.orders.filter(order => order.customer.id === customerId);
        customerOrders.forEach(o => console.log(o.getDetails()));
    }
    calculateTotalRevenue(): number{
        return this.orders.reduce((total, order) => total+ order.totalAmount, 0);
    }
    updateProductStock(productId: number, newStock: number): void{
        const product = this.findEntityById(this.products, productId);
        if(product){
            product.stock = newStock;
            console.log(`Đã cập nhật stock cho sản phẩm ${product.name}`);
        }
        else{
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

myStore.listAvailableProducts();