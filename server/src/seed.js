"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_1 = require("./lib/prisma");
var bcrypt = require("bcrypt");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var existingAdmin, hashedPassword, brands, _i, brands_1, b, testimonials, _a, testimonials_1, t, faqs, _b, faqs_1, f, p1, p2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log('Starting seed...');
                    return [4 /*yield*/, prisma_1.default.admin.findUnique({ where: { username: 'admin' } })];
                case 1:
                    existingAdmin = _c.sent();
                    if (!!existingAdmin) return [3 /*break*/, 4];
                    return [4 /*yield*/, bcrypt.hash('admin123', 10)];
                case 2:
                    hashedPassword = _c.sent();
                    return [4 /*yield*/, prisma_1.default.admin.create({
                            data: { username: 'admin', password: hashedPassword }
                        })];
                case 3:
                    _c.sent();
                    console.log('Admin seeded.');
                    _c.label = 4;
                case 4: 
                // 2. SiteSettings
                return [4 /*yield*/, prisma_1.default.siteSettings.upsert({
                        where: { id: 'global' },
                        update: {},
                        create: { id: 'global' }
                    })];
                case 5:
                    // 2. SiteSettings
                    _c.sent();
                    console.log('SiteSettings seeded.');
                    brands = [
                        { name: 'Kementerian Kelautan', logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&q=80' },
                        { name: 'Pelindo', logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&q=80' },
                        { name: 'PTPN', logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&q=80' }
                    ];
                    _i = 0, brands_1 = brands;
                    _c.label = 6;
                case 6:
                    if (!(_i < brands_1.length)) return [3 /*break*/, 9];
                    b = brands_1[_i];
                    return [4 /*yield*/, prisma_1.default.brand.create({ data: b })];
                case 7:
                    _c.sent();
                    _c.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9:
                    console.log('Brands seeded.');
                    // 4. Categories
                    return [4 /*yield*/, prisma_1.default.category.createMany({
                            data: [
                                { name: 'Jas Hujan' },
                                { name: 'Cover Motor' },
                                { name: 'Cover Mobil' },
                                { name: 'Aksesoris' }
                            ],
                            skipDuplicates: true
                        })];
                case 10:
                    // 4. Categories
                    _c.sent();
                    console.log('Categories seeded.');
                    testimonials = [
                        { name: 'Budi Santoso', role: 'Pengendara Motor', content: 'Jas hujan Morva sangat awet! Sudah dipakai 2 tahun masih bagus tidak rembes sama sekali.', rating: 5, avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80' },
                        { name: 'Siti Aminah', role: 'Ibu Rumah Tangga', content: 'Cover motornya pas banget untuk NMAX, bahannya tebal dan benar-benar anti air.', rating: 5, avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80' }
                    ];
                    _a = 0, testimonials_1 = testimonials;
                    _c.label = 11;
                case 11:
                    if (!(_a < testimonials_1.length)) return [3 /*break*/, 14];
                    t = testimonials_1[_a];
                    return [4 /*yield*/, prisma_1.default.testimonial.create({ data: t })];
                case 12:
                    _c.sent();
                    _c.label = 13;
                case 13:
                    _a++;
                    return [3 /*break*/, 11];
                case 14:
                    console.log('Testimonials seeded.');
                    faqs = [
                        { question: 'Apakah bahan jas hujannya mudah robek?', answer: 'Tidak, kami menggunakan material PVC premium dengan ketebalan 0.25mm yang sangat kuat dan elastis.' },
                        { question: 'Apakah bisa melayani pemesanan custom untuk instansi?', answer: 'Tentu saja! Kami berpengalaman melayani pesanan ratusan pcs untuk berbagai instansi pemerintah maupun swasta lengkap dengan sablon logo.' }
                    ];
                    _b = 0, faqs_1 = faqs;
                    _c.label = 15;
                case 15:
                    if (!(_b < faqs_1.length)) return [3 /*break*/, 18];
                    f = faqs_1[_b];
                    return [4 /*yield*/, prisma_1.default.faq.create({ data: f })];
                case 16:
                    _c.sent();
                    _c.label = 17;
                case 17:
                    _b++;
                    return [3 /*break*/, 15];
                case 18:
                    console.log('FAQs seeded.');
                    return [4 /*yield*/, prisma_1.default.product.create({
                            data: {
                                name: 'Jas Hujan Premium Original',
                                category: 'Jas Hujan',
                                price: 250000,
                                description: 'Jas Hujan dengan kualitas jahitan ganda berselotip anti rembes.',
                                isFeatured: true,
                                images: { create: [{ url: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', publicId: 'dummy1' }] },
                                sizes: { create: [{ name: 'L' }, { name: 'XL' }] },
                                variants: { create: [{ name: 'Hitam' }, { name: 'Navy' }] }
                            }
                        })];
                case 19:
                    p1 = _c.sent();
                    return [4 /*yield*/, prisma_1.default.product.create({
                            data: {
                                name: 'Cover Motor NMAX/PCX Ultimate',
                                category: 'Cover Motor',
                                price: 185000,
                                description: 'Sarung motor tebal menolak air seperti daun talas.',
                                isFeatured: true,
                                images: { create: [{ url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', publicId: 'dummy2' }] },
                                sizes: { create: [{ name: 'All Size' }] },
                                variants: { create: [{ name: 'Silver' }, { name: 'Merah' }] }
                            }
                        })];
                case 20:
                    p2 = _c.sent();
                    console.log('Products seeded.');
                    console.log('Seeding finished.');
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (e) {
    console.error(e);
    process.exit(1);
}).finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.default.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
