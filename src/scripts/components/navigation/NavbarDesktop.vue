
<template lang="pug">
  .navbar__desktop
    transition(name="fade")
      .navbar__desktop__overlay(v-if="subnav")
    .navbar__desktop__wrapper.u-bg-main
      .container.container--nav
        .navbar__left
          slot(name="logo")
          .navbar__links
            ul.navbar__linklist
              li.navbar__linklist__link(v-for="link in links", :key="link.title")
                a(:href="link.url", @mouseenter="showSubnav(link.handle)", @focus="showSubnav(link.handle)", v-if="link.children") {{ link.title }}
                a(:href="link.url", @mouseenter="hideSubnav", @focus="hideSubnav", v-else) {{ link.title }}
                transition(name="fade", v-if="link.children")
                  .navbar__subnav(:key="link.handle", v-if="subnav && subnav === link.handle", @mouseleave="hideSubnav")
                    .container.container--nav.navbar__subnav__container
                      a.navbar__subnav__link(
                        :href="childLink.url", 
                        v-for="childLink in link.children", 
                        :key="childLink.title"
                      ) {{ childLink.title }}
        .navbar__right
          .navbar__search
            navbar-search(
              ref="searchBox", 
              v-model="searchParam", 
              @open-results="showSubnav('search')", 
              @close-results="hideSearch"
            )
            transition(name="fade")
              .navbar__subnav(
                v-if="subnav && subnav === 'search'",
                @mouseenter="overSearchResults = true", 
                @mouseleave="overSearchResults = false"
              )
                .container.container--nav.navbar__subnav__container
                  navbar-search-results(
                    ref="searchResults",
                    :search="searchParam",
                    :suggestions="suggestedSearches",
                    @selected="suggestionSelected",
                    @close-results="hideSearch"
                  )
          ul.navbar__linklist
            li.navbar__linklist__link
              icon-link(icon="user", :href="this.userLink", :label="userLabel")
            li.navbar__linklist__link
              navbar-cart
</template>

<script>
  import NavbarSearch from 'scripts/components/navigation/NavbarSearch.vue'
  import NavbarCart from 'scripts/components/navigation/NavbarCart.vue'
  import NavbarSearchResults from 'scripts/components/navigation/NavbarSearchResults.vue'
  import IconLink from 'scripts/components/buttons/IconLink.vue'

  export default {
    name: 'NavbarDesktop',
    components: { NavbarSearch, NavbarSearchResults, NavbarCart, IconLink },
    props: {
      links: Array,
      loggedIn: Boolean,
      suggestedSearches: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        subnav: null,
        searchParam: '',
        overSearchResults: false
      }
    },
    computed: {
      userLink () {
        return (this.loggedIn) ? '/account' : '/account/login'
      },
      userLabel () {
        return (this.loggedIn) ? 'My Account' : 'Log In'
      }
    },
    methods: {
      showSubnav(subnav) {
        this.subnav = subnav
      },
      hideSearch () {
        if (!this.overSearchResults) this.hideSubnav()
      },
      hideSubnav () {
        this.subnav = null
      },
      suggestionSelected (suggestion) {
        this.$refs.searchBox.update(suggestion)
      }
    }
  }
</script>

<style scoped lang="scss">
  .navbar {
    &__desktop {
      &__overlay {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        background-color: $bg--overlay;
      }

      &__wrapper {
        position: relative;
        transition: 0.3s ease all;

        & > .container--nav {
          padding-top: 20px;
          padding-bottom: 20px;
          display: flex;
          justify-content: space-between
        }
      }
    }

    &__left,
    &__right {
      display: flex;
      align-items: center;
    }
    
    &__links {
      height: 100%;
      padding-left: 60px;
      display: flex;
      justify-content: flex-end;
    }

    &__linklist {
      list-style: none;
      display: flex;
      padding: 0;
      margin: 0;

      &__link {
        display: flex;
        align-items: center;

        .navbar__left & {
          &:not(:last-child) {
            margin-right: 35px;
          }
        }

        .navbar__right & {
          margin-left: 35px;
        }

        > a {
          font-weight: bold;
          font-size: rem(15);

          & {
            text-decoration: none;
          }

          &:hover {
            color: $color--accent;
          }
        }
      }
    }


    &__subnav {
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
      padding: 36px 12px;
      transform: translateY(100%);
      border-top: 1px solid $border--dark;
      background-color: $bg--main;

      &__container {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      &__link {
        &:not(:first-child) {
          margin-left: $grid-gutter;
        }
      }
    }
  }
</style>
