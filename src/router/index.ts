import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import NameSelectionView from '@/views/NameSelectionView.vue'
import UnavailableDatesView from '@/views/UnavailableDatesView.vue'
import HistoryView from '@/views/roster/HistoryView.vue'
import NewRosterView from '@/views/roster/NewRosterView.vue'
import RolesView from '@/views/admin/RolesView.vue'
import PeopleView from '@/views/admin/PeopleView.vue'
import UnavailabilityView from '@/views/roster/UnavailabilityView.vue'
import EditRosterView from '@/views/roster/EditRosterView.vue'
import ViewRostersView from '@/views/roster/ViewRostersView.vue'
import ConfigurationView from '@/views/admin/ConfigurationView.vue'
import { useGlobalToast } from '@/utils/toast'
import { nextTick } from 'vue'
import { USER_ROLES, useUserStore } from '@/stores/user'
import { getRosterById } from '@/utils/roster'
import {
  ADMIN_ROUTE_NAMES,
  DEFAULT_TITLE,
  hyphenate,
  path,
  ROSTER_ROUTE_NAMES,
  ROUTE_NAMES,
  UNAVAILABILITY_ROUTE_NAMES
} from '@/constants/constants'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: ROUTE_NAMES.HOME,
      component: HomeView,
      meta: {
        title: 'BCM Roster',
        requiresAuth: true
      }
    },
    {
      path: path(ROUTE_NAMES.NAME),
      name: ROUTE_NAMES.NAME,
      component: NameSelectionView,
      meta: {
        title: 'Who are you?',
        requiresAuth: true
      }
    },
    {
      path: path(ROUTE_NAMES.UNAVAILABILITY),
      children: [
        {
          path: UNAVAILABILITY_ROUTE_NAMES.VIEW,
          component: UnavailabilityView,
          meta: {
            title: 'Unavailability',
            requiresAuth: true,
            requiresAdmin: true
          }
        },
        {
          path: '',
          name: ROUTE_NAMES.UNAVAILABILITY,
          meta: {
            title: 'Unavailable Dates',
            requiresAuth: true
          },
          component: UnavailableDatesView
        }
      ]
    },
    {
      path: path(ROUTE_NAMES.LOGIN),
      name: ROUTE_NAMES.LOGIN,
      component: LoginView,
      meta: {
        title: 'Login'
      }
    },
    {
      path: path(ROUTE_NAMES.ADMIN),
      children: [
        {
          path: ADMIN_ROUTE_NAMES.PEOPLE,
          name: ADMIN_ROUTE_NAMES.PEOPLE,
          component: PeopleView,
          meta: {
            requiresAuth: true,
            requiresAdmin: true,
            title: 'People'
          }
        },
        {
          path: ADMIN_ROUTE_NAMES.ROLES,
          name: ADMIN_ROUTE_NAMES.ROLES,
          component: RolesView,
          meta: {
            requiresAuth: true,
            requiresAdmin: true,
            title: 'Roles'
          }
        },
        {
          path: ADMIN_ROUTE_NAMES.CONFIGURATION,
          name: ADMIN_ROUTE_NAMES.CONFIGURATION,
          component: ConfigurationView,
          meta: {
            requiresAuth: true,
            requiresAdmin: true,
            title: 'Configuration'
          }
        }
      ]
    },
    {
      path: path(ROUTE_NAMES.ROSTER),
      children: [
        {
          path: ROSTER_ROUTE_NAMES.NEW,
          component: NewRosterView,
          meta: {
            title: 'History',
            requiresAuth: true,
            requiresAdmin: true
          }
        },
        {
          path: ROSTER_ROUTE_NAMES.HISTORY,
          component: HistoryView,
          meta: {
            title: 'History',
            requiresAuth: true,
            requiresAdmin: true
          }
        },
        {
          path: ROSTER_ROUTE_NAMES.VIEW,
          children: [
            {
              path: ':id(\\d+)',
              name: hyphenate([ROUTE_NAMES.ROSTER, ROSTER_ROUTE_NAMES.VIEW]),
              component: EditRosterView,
              meta: {
                requiresAuth: true,
                requiresAdmin: true
              },
              props: true
            },
            {
              path: '',
              component: ViewRostersView,
              meta: {
                requiresAuth: true,
                requiresAdmin: true
              }
            }
          ]
        }
      ]
    },
    {
      path: path(ROUTE_NAMES.LOGOUT),
      name: ROUTE_NAMES.LOGOUT,
      component: LoginView
    },
    {
      path: '/:pathMatch(.*)*',
      name: ROUTE_NAMES.UNKNOWN,
      redirect: '/'
    }
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// toast and toggle dark stuffs

const globalToast = useGlobalToast()

// route validations
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  if (to.name === ROUTE_NAMES.LOGOUT) {
    await userStore.logout()
    next({ name: ROUTE_NAMES.LOGIN })
  } else if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (to.meta.requiresAuth) {
      if (!userStore.isLoggedIn) {
        globalToast.info('Log in to view requested page')
        next({ name: ROUTE_NAMES.LOGIN })
      } else {
        if (to.meta.requiresAdmin) {
          if (!userStore.role.some((role) => role === USER_ROLES.ADMIN)) {
            globalToast.info('Sorry, admins only!')
            next({ name: ROUTE_NAMES.HOME })
          } else {
            next()
          }
        } else {
          next()
        }
      }
    } else {
      next()
    }
  } else if (to.matched.some((record) => record.meta.wip)) {
    if (userStore.role.some((role) => role === USER_ROLES.ADMIN)) {
      next()
    } else {
      globalToast.info('Sorry, page is not ready!')
      next(from)
    }
  } else next()
})

router.afterEach((to, _from) => {
  nextTick(() => (document.title = (to.meta.title as string) || DEFAULT_TITLE))
})

router.beforeResolve(async (to) => {
  if (to.name == hyphenate([ROUTE_NAMES.ROSTER, ROSTER_ROUTE_NAMES.VIEW])) {
    if (!Array.isArray(to.params.id)) {
      const id = Number.parseInt(to.params.id)
      await getRosterById(id)
    }
  }
})

export default router
