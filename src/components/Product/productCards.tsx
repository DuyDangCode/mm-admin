'use client';
import { Grid } from '@mantine/core';
import { PCard } from './pcard';
import { Product } from '@/utils/response';
import { Toaster } from 'react-hot-toast';

const RATING_DATA = [
  'Tất cả',
  'Một sao',
  'Hai sao',
  'Ba sao',
  'Bốn sao',
  'Năm sao',
];

const SORT_DATA = [
  'Giá cao nhất',
  'Giá thấp nhất',
  'Đánh giá cao nhất',
  'Đánh giá thấp nhất',
];

export const ProductCards = ({
  data,
  selectedRating,
  selectedSort,
}: {
  data: Product[];
  selectedRating: string | null;
  selectedSort: string | null;
}) => {
  const convertRatingNumber2String = (
    ratingData: any,
    rating: number | string | null
  ): number | string => {
    if (typeof rating === 'string') {
      for (let i = 0; i < ratingData.length; i++) {
        if (ratingData[i] === rating) {
          return i;
        }
      }
    }
    return rating ? ratingData[rating] : 0;
  };

  const sortByPrice = (data: Product[], isAscending: boolean = false) => {
    for (let i = 0; i < data.length - 1; i++) {
      for (let j = 1; j < data.length; j++) {
        if (isAscending) {
          if (data[i].product_price > data[j].product_price) {
            const temp = swap(data[i], data[j]);
            data[i] = temp.product1;
            data[j] = temp.product2;
          }
        } else {
          if (data[i].product_price < data[j].product_price) {
            const temp = swap(data[i], data[j]);
            data[i] = temp.product1;
            data[j] = temp.product2;
          }
        }
      }
    }
  };
  const sortByRating = (data: Product[], isAscending: boolean = false) => {
    for (let i = 0; i < data.length - 1; i++) {
      for (let j = 1; j < data.length; j++) {
        if (isAscending) {
          if (data[i].product_ratingAverage > data[j].product_ratingAverage) {
            const temp = swap(data[i], data[j]);
            data[i] = temp.product1;
            data[j] = temp.product2;
          }
        } else {
          if (data[i].product_ratingAverage < data[j].product_ratingAverage) {
            const temp = swap(data[i], data[j]);
            data[i] = temp.product1;
            data[j] = temp.product2;
          }
        }
      }
    }
  };

  const sortByCreatedAt = (data: Product[], isAscending: boolean = false) => {
    for (let i = 0; i < data.length - 1; i++) {
      for (let j = 1; j < data.length; j++) {
        if (isAscending) {
          if (data[i].createdAt > data[j].createdAt) {
            const temp = swap(data[i], data[j]);
            data[i] = temp.product1;
            data[j] = temp.product2;
          }
        } else {
          if (data[i].createdAt < data[j].createdAt) {
            const temp = swap(data[i], data[j]);
            data[i] = temp.product1;
            data[j] = temp.product2;
          }
        }
      }
    }
  };

  const swap = (product1: Product, product2: Product) => {
    const temp: Product = product1;
    product1 = product2;
    product2 = temp;
    return { product1, product2 };
  };

  const sortStrategy = {
    0: sortByPrice,
    1: sortByRating,
    2: sortByCreatedAt,
  };

  const sortProducts = (productList: Product[], sortType: string | null) => {
    switch (sortType) {
      case 'Giá cao nhất':
        sortStrategy[0](productList);
        break;
      case 'Giá thấp nhất':
        sortStrategy[0](productList, true);
        break;
      case 'Đánh giá cao nhất':
        sortStrategy[1](productList);
        break;
      case 'Đánh giá thấp nhất':
        sortStrategy[1](productList, true);
        break;
      case 'Sản phẩm mới':
        sortStrategy[2](productList);
        break;
    }
  };

  sortProducts(data, selectedSort);

  return (
    <Grid w='100%' columns={15}>
      {data.map((item: Product) => {
        if (
          selectedRating === 'Tất cả' ||
          Math.ceil(item.product_ratingAverage) ===
            convertRatingNumber2String(RATING_DATA, selectedRating)
        ) {
          return (
            <Grid.Col key={item._id} span={{ base: 15, md: 5, lg: 3, sm: 15 }}>
              <PCard data={item} />
            </Grid.Col>
          );
        }
      })}
    </Grid>
  );
};
