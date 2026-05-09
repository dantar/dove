docker run -it --rm \
    --network dove_default \
    alpine/socat \
    tcp-listen:25432,fork,reuseaddr \
    tcp-connect:database:5432