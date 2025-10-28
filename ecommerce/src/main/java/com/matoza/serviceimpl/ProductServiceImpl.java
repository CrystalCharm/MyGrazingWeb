package com.matoza.serviceimpl;

import com.matoza.entity.ProductData;
import com.matoza.model.Product;
import com.matoza.model.ProductCategory;
import com.matoza.repostory.ProductDataRepository;
import com.matoza.service.ProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    ProductDataRepository productDataRepository;


    public List<Product> getAllProducts() {
        List<ProductData>productDataRecords = new ArrayList<>();
        List<Product> products =  new ArrayList<>();

        productDataRepository.findAll().forEach(productDataRecords::add);
        Iterator<ProductData> it = productDataRecords.iterator();

        while(it.hasNext()) {
            Product product = new Product();
            ProductData productData = it.next();

            product.setId(productData.getId());
            product.setName(productData.getName());
            product.setCategoryName(productData.getCategoryName());
            product.setImageFile(productData.getImageFile());
            product.setDescription(productData.getDescription());
            product.setUnitOfMeasure(productData.getUnitOfMeasure());
            product.setPrice(productData.getPrice());
            product.setQuantityInStock(productData.getQuantityInStock());
            products.add(product);
        }
        return products;
    }
    @Override
    public List<ProductCategory> listProductCategories()
    {
        Map<String,List<Product>> mappedProduct = getCategoryMappedProducts();
        List<ProductCategory> productCategories = new ArrayList<>();
        for(String categoryName: mappedProduct.keySet()){
            ProductCategory productCategory =  new ProductCategory();
            productCategory.setCategoryName(categoryName);
            productCategory.setProducts(mappedProduct.get(categoryName));
            productCategories.add(productCategory);
        }
        return productCategories;
    }
    @Override
    public Map<String,List<Product>> getCategoryMappedProducts()
    {
        Map<String,List<Product>> mapProducts = new HashMap<String,List<Product>>();

        List<ProductData>productDataRecords = new ArrayList<>();
        List<Product> products;

        productDataRepository.findAll().forEach(productDataRecords::add);
        Iterator<ProductData> it = productDataRecords.iterator();

        while(it.hasNext()) {
            Product product = new Product();
            ProductData productData = it.next();

            if(mapProducts.containsKey(productData.getCategoryName())){
                products = mapProducts.get(productData.getCategoryName());
            }
            else {
                products = new ArrayList<Product>();
                mapProducts.put(productData.getCategoryName(), products);
            }
            product.setId(productData.getId());
            product.setName(productData.getName());
            product.setCategoryName(productData.getCategoryName());
            product.setImageFile(productData.getImageFile());
            product.setDescription(productData.getDescription());
            product.setUnitOfMeasure(productData.getUnitOfMeasure());
            product.setPrice(productData.getPrice());
            product.setQuantityInStock(productData.getQuantityInStock());
            products.add(product);
        }
        return mapProducts;
    }

    @Override
    public Product[] getAll() {
            List<ProductData> productsData = new ArrayList<>();
            List<Product> products = new ArrayList<>();
            productDataRepository.findAll().forEach(productsData::add);
            Iterator<ProductData> it = productsData.iterator();
            while(it.hasNext()) {
                ProductData productData = it.next();
                Product product = new Product();
                product.setId(productData.getId());
                product.setName(productData.getName());
                products.add(product);
            }
            Product[] array = new Product[products.size()];
            for  (int i=0; i<products.size(); i++){
                array[i] = products.get(i);
            }
            return array;
        }
    @Override
    public Product get(Integer id) {
        log.info(" Input id >> "+  Integer.toString(id) );
        Product product = null;
        Optional<ProductData> optional = productDataRepository.findById(id);
        if(optional.isPresent()) {
            log.info(" Is present >> ");
            product = new Product();
            product.setId(optional.get().getId());
            product.setName(optional.get().getName());
        }
        else {
            log.info(" Failed >> unable to locate id: " +  Integer.toString(id)  );
        }
        return product;
    }
        @Override
        public Product create(Product product) {
            log.info(" add:Input " + product.toString());
            ProductData productData = new ProductData();
            productData.setName(product.getName());
            productData.setCategoryName(product.getCategoryName());
            productData.setDescription(product.getDescription());
            productData.setUnitOfMeasure(product.getUnitOfMeasure());
            productData.setImageFile(product.getImageFile());
            productData.setPrice(product.getPrice());
            productData = productDataRepository.save(productData);
            log.info(" add:Input " + productData.toString());
            Product newProduct = new Product();
            newProduct.setId(productData.getId());
            newProduct.setName(productData.getName());
            newProduct.setDescription(productData.getDescription());
            newProduct.setCategoryName(productData.getCategoryName());
            newProduct.setPrice(productData.getPrice());
            newProduct.setUnitOfMeasure(productData.getUnitOfMeasure());
            newProduct.setImageFile(productData.getImageFile());
            newProduct.setQuantityInStock(productData.getQuantityInStock());
            return newProduct;
        }

    @Override
    public Product update(Product product) {
        int id = product.getId();
        Optional<ProductData> optional = productDataRepository.findById(id);

        if (optional.isPresent()) {
            // Get the existing product data
            ProductData existingProductData = optional.get();

            // Update the existing product data with new values
            existingProductData.setName(product.getName());
            existingProductData.setDescription(product.getDescription());
            existingProductData.setCategoryName(product.getCategoryName());
            existingProductData.setImageFile(product.getImageFile());
            existingProductData.setUnitOfMeasure(product.getUnitOfMeasure());
            existingProductData.setQuantityInStock(product.getQuantityInStock());

            // Save the updated product data
            ProductData updatedProductData = productDataRepository.save(existingProductData);

            // Optionally convert back to Product if needed
            Product updatedProduct = new Product();
            updatedProduct.setId(updatedProductData.getId());
            updatedProduct.setName(updatedProductData.getName());
            updatedProduct.setDescription(updatedProductData.getDescription());
            updatedProduct.setCategoryName(updatedProductData.getCategoryName());
            updatedProduct.setImageFile(updatedProductData.getImageFile());
            updatedProduct.setUnitOfMeasure(updatedProductData.getUnitOfMeasure());
            updatedProduct.setQuantityInStock(updatedProductData.getQuantityInStock());

            return updatedProduct; // Return the updated product
        } else {
            log.error("Product record with id: " + id + " does not exist.");
            return null; // Or throw an exception if you prefer
        }
    }

    @Override
    public void delete(Integer id) {
        Product product = null;
        log.info(" Input >> " +  Integer.toString(id));
        Optional<ProductData> optional = productDataRepository.findById(id);
        if( optional.isPresent()) {
            ProductData productDatum = optional.get();
            productDataRepository.delete(optional.get());
            log.info(" Successfully deleted Product record with id: " + Integer.toString(id));
        }
        else {
            log.error(" Unable to locate product with id:" +  Integer.toString(id));
        }
    }


}
