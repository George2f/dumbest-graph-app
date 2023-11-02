import LINK_TYPE_ENUM from '../types/LinkTypeEnum';
import ILink from '../types/ILink';

export default function parseLinkName(link: ILink) {
    return (
        link.node1Name +
        (link.type === LINK_TYPE_ENUM.BOTH_WAYS ? ' <= ' : ' == ') +
        link.name +
        (link.type === LINK_TYPE_ENUM.A_TO_B ||
        link.type === LINK_TYPE_ENUM.BOTH_WAYS
            ? ' => '
            : ' == ') +
        link.node2Name
    );
}
