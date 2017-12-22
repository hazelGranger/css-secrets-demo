import Index from '@v/index';
import BgAndBorders from '@v/bgAndBorders'
import Shapes from '@v/shapes'
import VisualEffects from '@v/visualEffects'
import Typography from '@v/typography'
import UserExperience from '@v/userExperience'
import BlurDialog from '@v/blurDialog'
import StructureAndLayout from '@v/structureAndLayout'
import FluidBg from '@v/fluidBg'
import VerticalCenter from '@v/verticalCenter'
import StickyFooter from '@v/stickyFooter'
import TransitionsAndAnimations from '@v/transitionsAndAnimations'

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
