'use client';

import { createTheme, Container, rem } from '@mantine/core';

const CONTAINER_SIZES: Record<string, string> = {
  xxs: rem(300),
  xs: rem(400),
  sm: rem(500),
  md: rem(600),
  lg: rem(700),
  xl: rem(800),
  xxl: rem(900),
};
export const theme = createTheme({
  colors: {
    'turquoise': ['#E9F9F8', '#D6F7F6', '#BDEFEE', '#6DE3DF', '#29DAD5', '#02CAC4', '#02B1AB', '#029792', '#017E7A', '#016562']
  },
  primaryColor: 'turquoise',
  components: {
    Container: Container.extend({
      vars: (_, { size, fluid }) => ({
        root: {
          '--container-size': fluid
            ? '100%'
            : size !== undefined && size in CONTAINER_SIZES
              ? CONTAINER_SIZES[size]
              : rem(size),
        },
      }),
    }),
  },

});