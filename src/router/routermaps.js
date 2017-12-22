import Index from '../views/index';
import BgAndBorders from '../views/bgAndBorders'
import Shapes from '../views/shapes'
import VisualEffects from '../views/visualEffects'
import Typography from '../views/typography'
import UserExperience from '../views/userExperience'
import BlurDialog from '../views/blurDialog'
import StructureAndLayout from '../views/structureAndLayout'
import FluidBg from '../views/fluidBg'
import VerticalCenter from '../views/verticalCenter'
import StickyFooter from '../views/stickyFooter'
import TransitionsAndAnimations from '../views/transitionsAndAnimations'

const routermaps = [{
  path: '/',
  component: Index
},{
  path: '/index',
  component: Index
},{
  path: '/bgAndBorders',
  component: BgAndBorders,
  meta: { scrollToTop: true }
},{
  path: '/shapes',
  component: Shapes,
  meta: { scrollToTop: true }
},{
  path: '/visualEffects',
  component: VisualEffects,
  meta: { scrollToTop: true }
},{
  path: '/typography',
  component: Typography,
  meta: { scrollToTop: true }
},{
  path: '/userExperience',
  component: UserExperience,
  meta: {scrollToTop: true }
},{
  path: '/blurDialog',
  component: BlurDialog
},{
  path: '/structureAndLayout',
  component: StructureAndLayout,
  meta: { scrollToTop: true }
},{
  path: '/fluidBg',
  component: FluidBg
},{
  path: '/verticalCenter/:id',
  component: VerticalCenter
},{
  path: '/stickyFooter',
  component: StickyFooter
},{
  path: '/transitionsAndAnimations',
  component: TransitionsAndAnimations
}];

export default routermaps
