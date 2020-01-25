
<template lang="pug">
  .collection-grid--wrapper(v-if="collection")
    .collection-grid__sort-wrapper
      select-input.collection-grid__sort(
        :options="sortingOptions", 
        v-model="currentSortMethod", 
        label="Sort By",
        :required="true"
      )
    .collection-grid(v-if="sortedProducts")
      transition-group(name="grid-sort-animation" tag="div" class="row small-up-1 medium-up-4" v-if="collection")
        .column(v-for="item in sortedProducts", :key="(item.type === 'product') ? item.id : 'cta'", :class="{ 'cta-tile': item.type === 'cta' }")
          product-tile(
            v-if="item.type === 'product'",
            :title="item.title", 
            :image="item.images[0].src", 
            :image-alt="item.images[0].alt",
            :hover-image="item.images[1].src",
            :price="item.price",
            :url="item.url"
          )
          cta-tile(v-else-if="item.type === 'cta' && item.backgroundImage"
            :title="item.title"
            :description="item.description"
            :btn-text="item.btnText"
            :btn-link="item.btnUrl"
            :background-image="item.backgroundImage"
            :overlay-opacity="item.overlayOpacity"
          )
</template>

<script>
  import { mapState } from 'vuex';

  import CollectionBanner from 'scripts/components/collection/CollectionBanner.vue';
  import CtaTile from 'scripts/components/collection/CtaTile.vue';
  import ProductTile from 'scripts/components/product/ProductTile.vue';
  import SelectInput from 'scripts/components/forms/SelectInput.vue';

  import { sortProductsBy } from 'scripts/lib/sort.js';

  export default {
    name: 'CollectionGrid',
    components: { CollectionBanner, CtaTile, ProductTile, SelectInput },
    props: {
      handle: String,
      cta: Object
    },
    data () {
      return {
        currentSortMethod: '',
        sortingOptions: [
          { label: 'Alphabetically', value: 'alphabetically' },
          { label: 'Price - Descending', value: 'priceDesc' },
          { label: 'Price - Ascending', value: 'priceAsc' }
        ]
      }
    },
    computed: {
      ...mapState({
        collections: state => state.collections.all
      }),
      collection () {
        return this.collections.find(collection => collection.handle === this.handle)
      },
      sortedProducts () {
        const ctaPosition = this.cta.position
        const sortedArr = this.collection.products
          .sort(sortProductsBy(this.currentSortMethod))
          .map(product => ({ ...product, type: 'product' }))

        if (this.cta) {
          if (sortedArr.length < this.cta.position) {
            sortedArr.push(this.cta)
          } else {
            sortedArr.splice(this.cta.position - 1, 0, this.cta)
          }
        }

        return sortedArr
      }
    },
    created () {
      this.$store.dispatch('collections/addCollection', this.handle)
    }
  }
</script>

<style scoped lang="scss">
  .column.cta-tile {
    width: 100%;

    @include tablet-up {
      width: 66.666666%;
    }

    @include desktop-up {
      width: 50%;
    }
  }

  .collection-grid {
    position: relative;

    @include tablet-up {
      margin-bottom: 150px;
    }

    &__sort {
      &-wrapper {
        display: flex;
        justify-content: center;
        margin-bottom: 18px;

        @include tablet-up {
          justify-content: flex-end;
          margin-bottom: 36px;
        }
      }
    }

    &__loading {
      position: absolute;
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }

  .grid-sort-animation-move {
    transition: transform 0.5s cubic-bezier(0.77, 0, 0.175, 1);
  }
</style>