
import React from "react";

const index = ({
  items,
  resourcName,
  ItemComponent,
  className,
  activeItem,
}: { items: any[], resourcName: string, ItemComponent: any, className: string, activeItem: string }) => {

  return (

    <li className={className} >
      {
        items.map((item: any, i) => {
         
          return (


            <ItemComponent
              key={i}
              {...{ [resourcName]: item }}
              isActive={item.name === activeItem}
            />



          );
        })
      }
    </li >
  );
};

export default index;

