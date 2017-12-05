const tableContent = {
  "table1": [["If we don’t…","specify a cell width, they will be assigned one that depends on their contents. Notice how the cell with the more content here is much wider."]],
  "table2": [["If we don’t…","specify a cell width, they will be assigned one that depends on their contents. Notice how the cell with the more content here is much wider."],
              ["All rows take part in calculating the widths, not just the first one.","Notice how the dimensions here are different than the previous example."]],
  "table3": [[{
      "content":"If we specify a width, it will not always be followed. I have a width of 1000px",
      "styles": "onethousand"},{
      "content": "…and I have a width of 2000px. Because there’s not enough space for 3000px, they are reduced proportionally, to 33.3% and 66.6% of the total width.",
      "styles": "threethousand"
    }]],
  "table4": [["If we prevent word wrapping, the table can become so wide it grows beyond its container.",
  {
    "content": "…and text-overflow: ellipsis doesn’t help either.",
    "styles": "noWrapping"
  }]],
  "table5": [["Large images and blocks of code can also cause the same issue.",{"imgSrc":"http:\/\/lea.verou.me\/book\/panoramic.jpg"}]]
}

export default tableContent
