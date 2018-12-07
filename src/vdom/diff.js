import render from './render'
const zip = (xs, ys) => {
    const zipped = [];
    for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
      zipped.push([xs[i], ys[i]]);
    }
    return zipped;
};

const diffAttrs = (oldAttrs, newAttrs) => {
    const patches = [];

    for (const [k, v] of Object.entries(newAttrs)) {
        patches.push($node => {
            $node.setAttribute(k, v)
            return $node
        })
    }

    for (const k in oldAttrs) {
        if (!(k in newAttrs)) {
            patches.push($node => {
                $node.removeAttribute(k)
                return $node
            })
        }
    }

    return $node => {
        patches.forEach(patch => {
            patch($node)
        })
        return $node
    }
}

const diffChildren = (oldVChildren, newVChildren) => {
    const childPatches = [];
    oldVChildren.forEach((oldVChild, i) => {
      childPatches.push(diff(oldVChild, newVChildren[i]));
    });
  
    const additionalPatches = [];
    for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
      additionalPatches.push($node => {
        $node.appendChild(render(additionalVChild));
        return $node;
      });
    }
  
    return $parent => {
      // since childPatches are expecting the $child, not $parent,
      // we cannot just loop through them and call patch($parent)
      for (const [patch, $child] of zip(childPatches, $parent.childNodes)) {
        patch($child);
      }
  
      for (const patch of additionalPatches) {
        patch($parent);
      }
      return $parent;
    };
};
const diff = (oldVTree, newVTree) => {
    if (newVTree === undefined) {
        return $node => {
            $node.remove()
            return undefined
        }
    }

    if (typeof oldVTree === 'string' || typeof newVTree === 'string') {
        // same string value
        if (oldVTree === newVTree) {
            return $node => $node
        }

        /**
         * 1. both are string but different values
         * 2. text node and element node
         * 
         * => just render the newVTree
         */
        return $node => {
            const $newNode = render(newVTree)
            $node.replaceWith($newNode)
            return $newNode
        }
    }

    // totally different trees
    if (oldVTree.tagName !== newVTree.tagName) {
        return $node => {
            const $newNode = render(newVTree)
            $node.replaceWith($newNode)
            return $newNode
        }
    }

    const patchAttrs = diffAttrs(oldVTree.attrs, newVTree.attrs)
    const patchChildren = diffChildren(oldVTree.children, newVTree.children)

    return $node => {
        patchAttrs($node)
        patchChildren($node)
        return $node
    }
}

export default diff
