
<template lang="pug">
  .navbar__mobile
    .navbar__mobile__header
      .navbar__mobile__left
        slot(v-if="showLogo", name="logo")
        transition(name="slide-fade-left", @after-enter="showLogo = false", @before-leave="showLogo = true")
          primary-button.navbar__mobile__close-subnav(
            v-if="subnav", 
            icon="arrow-left",
            icon-size="26px",
            :simple="true",
            :label="subnav | unhandleize"
            @click="closeSubnav"
          )
      .navbar__mobile__right
        .navbar__mobile__cart-wrapper
          navbar-cart
        navbar-hamburger(@open="openMenu", @close="closeMenu")
    transition(name="fade", @after-enter="enableLinks()", @leave="disableLinks()")
      .navbar__mobile__nav(v-if="isMenuOpen")
        transition-group.navbar__mobile__linklist(tag="ul", name="slide-fade-left")
          li.navbar__mobile__link(
            v-for="(link, index) in fullLinkList",
            v-if="showLinks",
            :key="link.title",
            :style="{ 'transition-delay': 0.1 * index + 's' }"
          )
            a(v-if="link.handle === 'search'", :href="link.url", @click.prevent="openSubnav('search')") {{ link.title }}
              transition(name="off-canvas-right")
                .navbar__mobile__subnav.navbar__mobile__subnav--search(v-if="subnav === 'search'", @click.stop)
                  navbar-search(ref="searchBox", v-model="searchParam", placeholder="Search")
                  navbar-mobile-search-results(:suggestions="suggestedSearches", :search="searchParam", @set-search="setSearch")
            a(v-else-if="link.children", href="#", @click.prevent="openSubnav(link.handle)") {{ link.title }}
              transition(name="off-canvas-right")
                .navbar__mobile__subnav(v-if="subnav === link.handle", @click.stop)
                  ul.navbar__mobile__linklist
                    li.navbar__mobile__link(v-for="childLink in link.children")
                      a(:href="childLink.url") {{ childLink.title }}
            a(v-else, :href="link.url") {{ link.title }}
          li.navbar__mobile__link.navbar__mobile__link--login(key="login")
            a(:href="userLink") {{ userLabel }}
</template>

<script>
  import { mapState } from 'vuex'
  import { allProductsHandle } from 'scripts/lib/config.collections.js'

  import NavbarCart from 'scripts/components/navigation/NavbarCart.vue'
  import NavbarHamburger from 'scripts/components/navigation/NavbarHamburger.vue'
  import NavbarSearch from 'scripts/components/navigation/NavbarSearch.vue'
  import NavbarMobileSearchResults from 'scripts/components/navigation/NavbarMobileSearchResults.vue'
  import PrimaryButton from 'scripts/components/buttons/PrimaryButton.vue'

  export default {
    name: 'NavbarMobile',
    components: { 
      NavbarCart, 
      NavbarHamburger, 
      NavbarSearch, 
      NavbarMobileSearchResults, 
      PrimaryButton
    },
    props: {
      links: {
        type: Array,
        default: () => []
      },
      loggedIn: {
        type: Boolean,
        default: false
      },
      suggestedSearches: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        isMenuOpen: false,
        showLinks: false,
        subnav: null,
        showLogo: true,
        searchParam: '',
        showSearchResults: false
      }
    },
    computed: {
      ...mapState({
        scrollTop: state => state.scroll.scrollTop
      }),
      userLink () {
        return (this.loggedIn) ? '/account' : '/account/login'
      },
      userLabel () {
        return (this.loggedIn) ? 'My Account' : 'Log In'
      },
      fullLinkList () {
        let links = this.links.slice()

        links.push({
          title: 'Search',
          handle: 'search',
          url: '#'
        })

        return links
      }
    },
    methods: {
      openMenu () {
        this.isMenuOpen = true
      },
      closeMenu () {
        this.isMenuOpen = false
        this.closeSubnav()
      },
      enableLinks () {
        this.showLinks = true
      },
      disableLinks () {
        this.showLinks = false
      },
      openSubnav (subnav) {
        this.subnav = subnav
      },
      closeSubnav () {
        this.subnav = null
      },
      setSearch (val) {
        this.$refs.searchBox.update(val)
      }
    }
  }
</script>

<style scoped lang="scss">
  .navbar__mobile {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    background-color: $bg--main;

    &__right {
      display: flex;
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: $mobile-nav-height;
      padding: 18px 20px;
      transition: 0.3s ease all;
    }

    &__cart-wrapper {
      display: flex;
      align-items: center;
      margin-right: 15px;
    }

    &__nav,
    &__subnav {
      position: fixed;
      background-color: $bg--main;
      width: 100%;
      height: calc(100% - #{$mobile-nav-height});
      top: $mobile-nav-height;
      left: 0;
      padding: 50px;
      overflow-y: auto;
    }

    &__subnav--search {
      padding: $grid-gutter;
    }

    &__close-subnav {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      padding-left: $grid-gutter;
      padding-right: 40px;

      &, &:hover {
        background-color: $bg--main;
      }
    }

    &__linklist {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    &__link {
      font-size: rem(24);
      line-height: 1.375;
      font-weight: bold;
      margin-top: 24px;

      &:first-child {
        margin-top: 0;
      }

      &--login {
        font-size: rem(14);

        &, &:first-child {
          margin-top: auto;
        }
      }
    }
  }
</style>