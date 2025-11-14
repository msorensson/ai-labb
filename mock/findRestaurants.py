restaurants = [
    {
        "name": "Bord 27",
        "city": "Göteborg",
        "area": "Vasastan",
        "cuisine": ["modern", "svenskt", "europeiskt"],
        "price_level": 3
    },
    {
        "name": "Elio",
        "city": "Göteborg",
        "area": "Centrum",
        "cuisine": ["italiensk", "medelhav"],
        "price_level": 2
    },
    {
        "name": "Natur",
        "city": "Göteborg",
            "area": "Avenyn",
        "cuisine": ["naturvin", "europeiskt"],
        "price_level": 3
    }
]

def find_restaurants(city=None, area=None, cuisine=None, max_price=None):
    result = []
    for r in restaurants:
        if city and r["city"].lower() != city.lower():
            continue
        if area and r["area"].lower() != area.lower():
            continue
        if cuisine:
            wanted = cuisine.lower()
            if not any(wanted in c.lower() for c in r["cuisine"]):
                continue
        if max_price and r["price_level"] > max_price:
            continue
        result.append(r)
    return result
