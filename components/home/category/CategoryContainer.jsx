import React from 'react';
import CategoryCard from './CategoryCard';

const CategoryContainer = ({ categories }) => {
  return (
    <div className="bg-gray-100 py-20 md:px-16 px-8">
      <h1
        style={{ lineHeight: '65px' }}
        className="md:text-4xl text-3xl font-medium text-center mb-10"
      >
        One Platform <br className="hidden md:block" /> Many{' '}
        <span className="text-blue-600">Solutions</span>
      </h1>
      <div>
        {categories.map((item) => (
          <CategoryCard
            key={item._id}
            title={item.name}
            total={item.count}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryContainer;
