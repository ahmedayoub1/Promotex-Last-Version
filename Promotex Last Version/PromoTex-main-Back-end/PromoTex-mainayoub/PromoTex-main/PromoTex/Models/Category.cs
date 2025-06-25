﻿namespace PromoTex.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int StoreId { get; set; }
        public Store Store { get; set; }
        public List<Product> Products { get; set; } = new List<Product>();
    }
}
